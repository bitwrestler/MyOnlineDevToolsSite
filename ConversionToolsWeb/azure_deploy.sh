#!/usr/bin/env bash
dotnet publish -c Release -o ./publish && zip publish.zip ./publish/* && az webapp deploy --resource-group WebAppResourceGroup --name DateTimeConversionTools --type zip --src-path ./publish.zip && rm publish.zip
