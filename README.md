# Common Voice ToolBox - Metadata Viewer

WepApp for examining Common Voice metadata in timeline, using tables and graphs.

## Description

Metadata for Mozilla Common Voice releases are published as separate json files after each release in a separate github repository. They contain basic, but important aggregated information which dataset engineers, community managers or trainers frequently reference. On the other, hand accessing this information on a github repo and finding what you are looking for, in multiple large json files is very time consuming, especially if you work on multiple languages, multiple versions and want to compare them.

This tool tries to solve this problem. It uses a flattened dataframe file generated by the Common Voice Toolbox utility and uses it like an embedded "database" to interactively show the information. There is no backend/server. Whenever Mozilla Common Voice makes a new dataset release, this utility will follow with a new release.

With this utility you can:

- View the data in table format or as graphs.
- Filter the versions you are interested in
- Select some languages and make some comperative analysis.
- See how a language is doing across versions and/or wrt to other languages.
- See overall totals of the Common Voice project

## Working Version

A working version is here for your use: 

## TODO

- Annotate and export the table
- Annotate and export the graphs
- A graph creator for your own graphs
- Some query/annotation tools, e.g. "what languages have between 100-200 hours of validated data".

The whole list can be found under the project in github. Please send an issue to request more.
