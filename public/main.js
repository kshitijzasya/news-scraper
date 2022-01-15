const scrape = document.getElementById("scrape");
const url = document.getElementById("url");
const date = document.getElementById("date-limit");

scrape.addEventListener("click", async(e) => {
  e.preventDefault(); 
  const response = await fetch(`/scrape?url= ${url.value}&date=${date.value}`);
  //resolve a promise  
  if (response.status == 200 ) {
    window.open('/download', '_blank');
  }
});