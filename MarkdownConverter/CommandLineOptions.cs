﻿namespace Karen.Command
{
    using CommandLine;

    public class CommandLineOptions
    {
        [Option('i', "input", Required = true, HelpText = "Set target directry(full path) which has markdown files.")]
        public string InputDirectry { get; set; }

        [Option('o', "output", Required = false, HelpText = "Optional. Set target directry(full path) to output converted json files.")]
        public string OutputDirectry { get; set; }

        [Option('v', "verbose", Required = false, HelpText = "Optional. Set output to verbose messages.")]
        public bool Verbose { get; set; }
    }
}