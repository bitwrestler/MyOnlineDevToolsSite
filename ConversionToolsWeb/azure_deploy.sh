#!/usr/bin/env bash

dotnet publish -c Release -o ./publish && \
 cd ./publish && \
 zip ../publish.zip -r ./* && \
  cd ..
  az webapp deploy --resource-group WebAppResourceGroup --name DateTimeConversionTools --type zip --src-path ./publish.zip && \
   rm ./publish.zip
