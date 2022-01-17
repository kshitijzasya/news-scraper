const scrape = document.getElementById("scrape");
const url = document.getElementById("url");
const date = document.getElementById("date-limit");
const spinner = document.getElementsByClassName('spinner-border')[0];

scrape.addEventListener("click", async(e) => {
  e.preventDefault(); 
  spinner.style.display = "block";
  console.log(url.value, date.value)
  if (url.value.length && date.value.length) {
    const response = await fetch(`/scrape?url= ${url.value}&date=${date.value}`);
  //resolve a promise  
  if (response.status == 200 ) {
    window.open('/download', '_blank');
  }
  } else {
    window.alert('Need valid inputs to proceed')
  }
  
  spinner.style.display = "none";
});