namespace Karen.Web
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using Karen.Service;
    using Microsoft.Extensions.FileProviders;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;

    public class DocWatchService : BackgroundService
    {
        private readonly ILogger<DocWatchService> _logger;
        readonly MarkdownConverterService _service;
        readonly IOptions<DocWatchOptions> _options;

        public DocWatchService(ILogger<DocWatchService> logger,
            MarkdownConverterService service,
            IOptions<DocWatchOptions> options)
        {
            this._logger = logger;
            this._service = service;
            this._options = options;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            DateTime now = DateTime.Now;
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation($"Start conversion for updated file.");
                try
                {
                    await _service.ConvertAsync(_options.Value.InputDirectry, _options.Value.OutputDirectry, now).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.ToString());
                }

                now = DateTime.Now;
                _logger.LogInformation($"Watch file after {now}");

                var tcs = GetFileProviderTask();
                using (stoppingToken.Register(() =>
                {
                    // this callback will be executed when token is cancelled
                    _logger.LogInformation($"token is cancelled!");
                    tcs.TrySetCanceled();
                }))
                {
                    await tcs.Task.ConfigureAwait(false);
                }
            }
        }

        private TaskCompletionSource<object> GetFileProviderTask()
        {
            var _fileProvider = new PhysicalFileProvider(_options.Value.InputDirectry);
            var tcs = new TaskCompletionSource<object>();
            var token = _fileProvider.Watch("**");

            token.RegisterChangeCallback(state =>
                ((TaskCompletionSource<object>)state).TrySetResult(null), tcs);

            return tcs;
        }
    }
}
