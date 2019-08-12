namespace Karen.Service
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;
    using Karen.Command;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using YamlDotNet.Serialization;

    public interface IMarkdownConverterService
    {
        Task RunAsync(CommandLineOptions options);
        Task ConvertAsync(string input, string output, DateTime? dateFrom = null);
    }

    public class MarkdownConverterService : IMarkdownConverterService
    {
        ILogger logger;
        Deserializer yamlDeserializer;
        JsonSerializer jsonSerializer;

        public MarkdownConverterService(ILogger<MarkdownConverterService> logger)
        {
            this.logger = logger;
            yamlDeserializer = new Deserializer();
            jsonSerializer = new JsonSerializer();
        }

        public async Task RunAsync(CommandLineOptions options)
        {
            try
            {
                await ConvertAsync(options.InputDirectry, options.OutputDirectry).ConfigureAwait(false);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ConvertAsync(string input, string output, DateTime? dateFrom = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(input))
                {
                    logger.LogError("input option should be set");
                    return;
                }

                var outputDirectory = GetOutputDirectoryInfo(output);
                if (File.Exists(input))
                {
                    logger.LogInformation($"target file: {input}");
                    var fi = new FileInfo(input);
                    await ConvertFileAsync(fi, outputDirectory).ConfigureAwait(false);
                }
                else if (Directory.Exists(input))
                {
                    var searchDirectory = new DirectoryInfo(input);
                    logger.LogInformation($"convert to json: target directory: {searchDirectory.ToString()}");
                    await SearchMarkdownFilesAsync(searchDirectory, outputDirectory, "", dateFrom).ConfigureAwait(false);

                    logger.LogInformation($"delete files and directories: target directory: {searchDirectory.ToString()}");
                    DeleteFilesAndDirectoriesIfRequired(searchDirectory, outputDirectory);

                    var docIndex = await GenerateIndexFileAsync(outputDirectory, "").ConfigureAwait(false);
                    if (docIndex.Count != 0)
                    {
                        await WriteFileIfRequiredAsync($"{outputDirectory.FullName}\\index.json", docIndex.ToString(Formatting.None)).ConfigureAwait(false);
                    }
                }
                else
                {
                    logger.LogError($"no directory or file exists: {input}");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        DirectoryInfo GetOutputDirectoryInfo(string outputDirPath)
        {
            if (!string.IsNullOrWhiteSpace(outputDirPath))
            {
                if (!Directory.Exists(outputDirPath))
                {
                    logger.LogTrace($"create new directory: {outputDirPath}");
                    Directory.CreateDirectory(outputDirPath);
                }
                return new DirectoryInfo(outputDirPath);
            }

            return null;
        }
        async Task WriteFileIfRequiredAsync(string fileName, string jsonString)
        {
            try
            {
                if (File.Exists(fileName))
                {
                    string GetSha1Hash(byte[] buffer)
                    {
                        using (var cryptoProvider = new SHA1CryptoServiceProvider())
                        {
                            var hash = BitConverter.ToString(cryptoProvider.ComputeHash(buffer));
                            return hash.Replace("-", "");
                        }
                    }

                    byte[] currentContentByte = null;
                    string currentHash = "";
                    using (var fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, false))
                    using (var streamReader = new StreamReader(fileStream))
                    {
                        var currentContent = streamReader.ReadToEnd();
                        currentContentByte = Encoding.Unicode.GetBytes(currentContent);
                        currentHash = GetSha1Hash(currentContentByte);
                    }

                    var newContentByte = Encoding.Unicode.GetBytes(jsonString);
                    string newHash = "";
                    newHash = GetSha1Hash(newContentByte);

                    if (currentHash == newHash)
                    {
                        logger.LogTrace($"no change detected, skip file: {fileName}");
                        return;
                    }
                }

                logger.LogInformation($"write json file: {fileName}");
                //_logger.LogTrace($"json string: {jsonString}");
                await File.WriteAllTextAsync(fileName, jsonString).ConfigureAwait(false);
            }
            catch (Exception)
            {
                throw;
            }
        }

        async Task SearchMarkdownFilesAsync(DirectoryInfo searchDir, DirectoryInfo outputDir, string docRef, DateTime? dateFrom)
        {
            var targetDirectories = searchDir.EnumerateDirectories();
            if (targetDirectories != null && targetDirectories.Count() > 0)
            {
                foreach (var recursiveDir in targetDirectories)
                {
                    var newOutputDir = GetOutputDirectoryInfo($"{outputDir}\\{recursiveDir.Name}");
                    var newDocRef = $"{docRef}/{recursiveDir.Name}";
                    logger.LogInformation($"convert to json: target directory: {newOutputDir.ToString()}");
                    await SearchMarkdownFilesAsync(recursiveDir, newOutputDir, newDocRef, dateFrom).ConfigureAwait(false);
                }
            }
            else
            {
                logger.LogTrace($"no recursive directory found");
            }

            var fileInfoList = searchDir.EnumerateFiles();
            if (dateFrom.HasValue)
            {
                fileInfoList = fileInfoList.Where(x => x.LastWriteTime >= dateFrom);
            }

            logger.LogTrace($"found {fileInfoList.Count()} files");

            // If only few files are converted, process is too fast and finished before start waiting. Then the process seems locked.
            // Wait very short time to avoid process lock
            if (fileInfoList.Count() < 10)
            {
                int millisec = 1;
                logger.LogTrace($"need to wait for {millisec} milli sec to avoid process lock.");
                await Task.Delay(millisec);
            }

            foreach (var file in fileInfoList)
            {
                await ConvertFileAsync(file, outputDir).ConfigureAwait(false);
            }
        }
        async Task<JObject> ConvertFileAsync(FileInfo file, DirectoryInfo outputDir)
        {
            var filePath = file.DirectoryName;
            if (outputDir != null)
            {
                filePath = outputDir.FullName;
            }

            string markdownExt = ".md";
            var extention = file.Extension.ToLower();
            if (extention != markdownExt)
            {
                logger.LogTrace($"skip file: {file.FullName}");
                return null;
            }

            logger.LogTrace($"read file: {file.FullName}");
            var text = string.Empty;
            using (var fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, false))
            using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
            {
                text = await streamReader.ReadToEndAsync().ConfigureAwait(false);
            }

            logger.LogTrace($"parse json to object");
            JObject json = ParseMarkdownContent(text);

            logger.LogTrace($"create or override file: {file.FullName}");
            var jsonFullName = $"{filePath}\\{Path.GetFileNameWithoutExtension(file.FullName)}.json";
            await WriteFileIfRequiredAsync(jsonFullName, json.ToString(Formatting.None)).ConfigureAwait(false);

            return json;
        }

        JObject ParseMarkdownContent(string text)
        {
            JObject json = null;
            var frontmatter = "";
            var body = "";

            var contents = text.Split("---");
            frontmatter = contents[1];
            if (contents.Length == 3)
            {
                body = contents[2];
            }
            else
            {
                var requiredContents = contents.Skip(2).ToArray();
                body = string.Join("---", requiredContents).Trim();
            }

            json = JObject.Parse(ParseFrontMatter(frontmatter));
            json.Add("body", body);

            return json;
        }

        string ParseFrontMatter(string yaml)
        {
            using (var reader = new StringReader(yaml))
            using (var writer = new StringWriter())
            {
                var yamlObject = yamlDeserializer.Deserialize(reader);
                jsonSerializer.Serialize(writer, yamlObject);
                writer.Flush();
                return writer.ToString();
            }
        }

        void DeleteFilesAndDirectoriesIfRequired(DirectoryInfo baseDir, DirectoryInfo outputDir, string docRef = "")
        {
            var orginalDir = baseDir.FullName + docRef;
            var orgDirInfo = new DirectoryInfo(orginalDir);

            logger.LogTrace($"check original directory exists: {orginalDir}");
            if (!orgDirInfo.Exists)
            {
                logger.LogInformation($"original directory doesn't exist. delete it: {outputDir.ToString()}");
                outputDir.Delete(true);
                return;
            }

            var targetDirectories = outputDir.EnumerateDirectories();
            if (targetDirectories != null && targetDirectories.Count() > 0)
            {
                foreach (var recursiveDir in targetDirectories)
                {
                    var newOutput = GetOutputDirectoryInfo(outputDir + "\\" + recursiveDir.Name);
                    var newDocRef = docRef + "\\" + recursiveDir.Name;
                    logger.LogInformation($"delete files and directories: target directory: {newOutput.ToString()}");
                    DeleteFilesAndDirectoriesIfRequired(baseDir, newOutput, newDocRef);
                }
            }
            else
            {
                logger.LogTrace($"no recursive directory found");
            }

            //TODO: to be considered if excluding index.json is required or not.
            var fileInfoList = outputDir.EnumerateFiles().Where(x => x.Name != "index.json");

            logger.LogTrace($"found {fileInfoList.Count()} files");
            foreach (var file in fileInfoList)
            {
                string jsonExt = ".json";
                var extention = file.Extension.ToLower();
                if (extention != jsonExt)
                {
                    logger.LogTrace($"skip file: {file.FullName}");
                    continue;
                }
                logger.LogTrace($"target file: {file.FullName}");

                var originalFilePath = $"{orginalDir}\\{Path.GetFileNameWithoutExtension(file.FullName)}.md";
                var orgFile = new FileInfo(originalFilePath);

                logger.LogTrace($"check original file exists: {originalFilePath}");
                if (!orgFile.Exists)
                {
                    logger.LogInformation($"original file doesn't exist. delete it: {file.FullName}");
                    file.Delete();
                }
            }
        }

        async Task<JArray> GenerateIndexFileAsync(DirectoryInfo _search, string _docRef)
        {
            var indexFile = new FileInfo($"{_search.FullName}\\index.json");
            if (indexFile.Exists)
            {
                logger.LogTrace($"delete index file first: {indexFile.FullName}");
                indexFile.Delete();
            }

            var docIndex = new JArray();
            async Task searchAllJsonFilesAsync(DirectoryInfo search, string docRef)
            {
                var targetDirectories = search.EnumerateDirectories();
                if (targetDirectories != null && targetDirectories.Count() > 0)
                {
                    foreach (var recursiveDir in targetDirectories)
                    {
                        var newDocRef = $"{docRef}/{recursiveDir.Name}";
                        logger.LogInformation($"generate index: target directory: {newDocRef.ToString()}");
                        await searchAllJsonFilesAsync(recursiveDir, newDocRef).ConfigureAwait(false);
                    }
                }
                else
                {
                    logger.LogTrace($"no recursive directory found");
                }

                var fileInfoList = search.EnumerateFiles();

                logger.LogTrace($"found {fileInfoList.Count()} files");
                foreach (var file in fileInfoList)
                {
                    string jsonExt = ".json";
                    var extention = file.Extension.ToLower();
                    if (extention != jsonExt)
                    {
                        logger.LogTrace($"skip file: {file.FullName}");
                        continue;
                    }

                    logger.LogTrace($"read file: {file.FullName}");
                    var text = string.Empty;
                    using (var fileStream = new FileStream(file.FullName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, false))
                    using (var streamReader = new StreamReader(fileStream, Encoding.UTF8))
                    {
                        text = await streamReader.ReadToEndAsync().ConfigureAwait(false);
                    }

                    JObject json = JObject.Parse(text);
                    if (json != null)
                    {
                        var doc = new JObject();
                        doc.Add("docRef", $"{docRef}/{Path.GetFileNameWithoutExtension(file.FullName)}");
                        doc.Add("content", json);
                        docIndex.Add(doc);
                    }
                }
            }

            await searchAllJsonFilesAsync(_search, _docRef).ConfigureAwait(false);
            return docIndex;
        }
    }
}
