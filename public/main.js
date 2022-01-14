const scrape = document.getElementById("scrape");
const url = document.getElementById("url");

scrape.addEventListener("click", async(e) => {
  e.preventDefault();
  const response = await fetch("/scrape?url=" + url.value);
  //resolve a promise
  const data = await response.json();
  console.log('data', data);

//   document.querySelector("#image").setAttribute("src", data.image);
//   document.querySelector("#price").innerText = data.price;
//   document.querySelector("#product").innerText = data.product;
});