let dropbox;
dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);


function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  
  function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
  
    const dt = e.dataTransfer;
    const files = dt.files;
    console.log(files);
  
    handleFiles(files);
  }

  let access_token;

  async function authenticateOrchestrator(){
    try{
    let response = await fetch("https://account.uipath.com/oauth/token",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "X-UIPATH-TenantName" : "stani",
            "Access-Control-Allow-Origin":"*"
        },
        body: JSON.stringify({
            "grant_type": "refresh_token",
            "client_id": "8DEv1AMNXczW3y4U15LL3jYf62jK93n5",
            "refresh_token": "ptLlfHrOwAiJVxmhZH4dOZzj9QxkYLEFkLDNQ-_NDs_OI"
        })
    })
    const bearer = await response.json();
    return bearer;
    }catch (error) {
    console.error(error);
    }
  }

  async function renderBearer() {

    const access_token = await authenticateOrchestrator();

    return access_token;
}

async function orchestratorGetDirectUploadUri(bearer){
    try {
        
        let response = await fetch("https://cloud.uipath.com/stani/stani/orchestrator_/odata/Buckets(27621)/UiPath.Server.Configuration.OData.GetWriteUri?path=rufus-3.21.exe",{
            "method" : "GET",
            headers: {
                "accept" : "application/json",
                "X-UIPATH-OrganizationUnitId" : "3150797",
                "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUTkVOMEl5T1RWQk1UZEVRVEEzUlRZNE16UkJPVU00UVRRM016TXlSalUzUmpnMk4wSTBPQSJ9.eyJodHRwczovL3VpcGF0aC9lbWFpbCI6ImhhbGxvd2VfZW5AYWJ2LmJnIiwiaHR0cHM6Ly91aXBhdGgvZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vYWNjb3VudC51aXBhdGguY29tLyIsInN1YiI6ImF1dGgwfDVkNmU1OGQ2MjhiZWQ3MGVmMzc4ZjkyOCIsImF1ZCI6WyJodHRwczovL29yY2hlc3RyYXRvci5jbG91ZC51aXBhdGguY29tIiwiaHR0cHM6Ly91aXBhdGguZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY3Mjk5MjY4MywiZXhwIjoxNjczMDc5MDgzLCJhenAiOiI4REV2MUFNTlhjelczeTRVMTVMTDNqWWY2MmpLOTNuNSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MifQ.NLbsCFwvOAxV9wKG44U-r2HEmancsrHfLlddLAbougFl1HQGvYd5lg9y06noExa8HDpDsAXscp1Fkquew9FbhTVrWQU7BoJY_nBV_TsecDH-As5-tpP6zI3TBvEFhuueMUfvOOgfEXlXYy-aqZ0DOjFWqBIFLScCA2H6AuQc4KUjhNio8a2-iORMekQya0n_mbymuUPl-giN60DEstaCaxXf7EmnC_KV-0oPfkIIlW8TcwMoa8qcplC1RguMg2qF9AzSJQYXCydjOfvQnBeSBVGhhy3oqyIx6iVr2wJmIK7223Ef0KMvpO3l7dfi66YRSGVlLWPjzfQYkNzRKmfqig"
            }
        })
        let uploadUri = await response.json();
        return uploadUri;
        
    } catch (error) {
        console.error("Uri failed" + error.message);
    }
}

async function renderUploadUri(uriBearer) {
    let uploadUri = await orchestratorGetDirectUploadUri(uriBearer);
    return uploadUri.Uri;
}
 

  async function handleFiles(upload){

    let token = await renderBearer();
    let uploadUri = await renderUploadUri(token);
    console.log("This is my uploadUri : "+ uploadUri);

    console.log(upload[0]);

        let file = upload[0];        
        let headers = new Headers();
        headers.append("x-ms-blob-type", "BlockBlob");
        headers.append("Content-Type", "application/x-msdos-program");
        
        let requestOptions = {
            method: 'PUT',
            headers: headers,
            body: file,
            redirect: 'follow'
          };

          fetch("https://crpaprodorch0nestg.blob.core.windows.net/orchestrator-96d8d330-ee21-4265-8321-2fd5535b9667/BlobFilePersistence/c2d203a3-8f80-49c0-a06f-8f593d2b722b/rufus-3.21.exe?sv=2021-08-06&st=2023-01-06T11%3A33%3A29Z&se=2023-01-06T12%3A33%3A59Z&sr=b&sp=cw&sig=1ilrlOTLNZYyk2ZB474hzgmYSS7%2Bm%2BLqZxjmGqzlmzk%3D",
           requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
        alert('The file has been uploaded successfully.');
    }