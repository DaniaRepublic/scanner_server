var scans = document.getElementsByClassName("scan");

for (let scan of scans) {
    scan.addEventListener('click', function (event) {
        console.log(scan.id);
    });
}
