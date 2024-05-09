let bookList=[],basketList=[];

const toogleModal=()=>{
  const basketModelEl=document.querySelector(".basket__modal");
    basketModelEl.classList.toggle("active");
};
const getBooks=()=>{
    fetch("./products.json")
    .then((res)=>res.json())
    .then((books)=>(bookList=books));
};
getBooks();
const createBookStars=(starRate)=>{
let starRateHtml="";
for(let i=1; i<=5;i++){
if(Math.round(starRate)>=i)starRateHtml+=` <i class="bi bi-star-fill active"></i>`;
else starRateHtml+=`<i class="bi bi-star-fill"></i>`
}
return starRateHtml;
};
const createBookItemsHtml=()=>{
  const bookListEl= document.querySelector(".book__list");
  let bookListHtml="";
bookList.forEach((book,index)=>{
bookListHtml +=` <div class="col-5 ${index % 2==0 && "offset-2"} my-5">
<div class="row book__card">
  <div class="col-6">
<img class="img-fluid shadow" src="${book.imgSource}" width="258" height="400px">
  </div>
  <div class="col-6">
    <div class="book__detail">
      <span class="fos gray fs-5">${book.author}</span>
      <span class="fs-4 fw-bold">${book.name}</span><br>
      <span class="book__star-rate">
      ${createBookStars(book.starRate)}
        <span class="book__reviews">${book.reviewCount}</span>
      </span>
    </div>
    <p class="book__description fos gray">${book.description}</p>
       <div>
        <span class="black fw-bold fs-5">${book.price}tl</span>
        ${book.oldPrice ? `<span class="gray fs-5 fw-bold">${book.oldPrice}</span>`:""}
       </div>
       <button class="btn__purple" onclick="addBookToBasket(${book.id})">ADD BASKET</button>
  </div>
</div>
</div>`
});
bookListEl.innerHTML=bookListHtml;
};
const BOOK_TYPES={
  ALL:"Tümü",
  NOVEL:"Roman",
  CHILDREN:"Çocuk",
  HISTORY:"Tarih",
  FINANCE:"Finans",
  SELFIMPROVEMENT:"Kişisel gelişim",
  SCIENCE:"Bilim",
};
const createBookTypesHtml=()=>{
  const filterEl=document.querySelector(".filter");
  let filterHtml="";
  let filterTypes=["ALL"];
  bookList.forEach(book=>{
    if(filterTypes.findIndex(filter=>filter==book.type) == -1) filterTypes.push(book.type);
  });
  filterTypes.forEach((type ,index)=>{
    filterHtml+=`<li class="${index==0 ? "active" : null}" onclick="filterBooks(this)" data-type="${type}">
    ${BOOK_TYPES[type] || type}</li>`
  });
  filterEl.innerHTML=filterHtml;
};
const filterBooks=(filterEl)=>{
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType=filterEl.dataset.type;
  getBooks();
if (bookType !="ALL") 
bookList=bookList.filter(book=>book.type==bookType);
createBookItemsHtml();
};
const listBasketItems=()=>{
  localStorage.setItem("basketList" , JSON.stringify(basketList));
 const basketListEl= document.querySelector(".basket__list");
const basketCountEl= document.querySelector(".basket__count")
basketCountEl.innerHTML=basketList.length>0 ? basketList.length:null;
const totalPriceEl=document.querySelector(".total__price");
  let basketListHtml="";
  let totalPrice=0;
  basketList.forEach(item=>{
    totalPrice+=item.product.price *item.qauntity;
basketListHtml+=` <li class="basket__item">
<img src="${item.product.imgSource}" width="100" height="100" />
<div class="basket__item-info">
  <h3 class="book__name">${item.product.name}</h3>
  <span class="book__price ">${item.product.price}tl</span><br>
  <span class="book__remove" onclick="removeItemToBasket(${item.product.id})">Remove</span>
</div>
<div class="book__count">
  <span class="decrease" onclick="decreaseItemToBasket(${item.product.id})">-</span>
  <span class="my-2">${item.qauntity}</span>
  <span class="increase"onclick="increaseItemToBasket(${item.product.id})">+</span>
</div>
</li>`;
  });
  basketListEl.innerHTML=basketListHtml ? basketListHtml :`   <li class="basket__item">
  No items to Buy again
</li>`;
 totalPriceEl.innerHTML=totalPrice >0 ? "Total:" +totalPrice.toFixed(2)+"tl" :null;
}
const addBookToBasket=(bookId)=>{
let findedBook=bookList.find((book)=>book.id==bookId);
if(findedBook){
  const basketAlreadyIndex=basketList.findIndex((basket)=>basket.product.id==bookId);
  if(basketAlreadyIndex == -1){ 
     let addedItem={qauntity :1 ,product : findedBook};
  basketList.push(addedItem)
}else{
  basketList[basketAlreadyIndex].qauntity+=1;
}
listBasketItems();
}
};
const removeItemToBasket=(bookId)=>{
const findedIndex =basketList.findIndex(basket => basket.product.id==bookId);
if(findedIndex!=-1){
  basketList.splice(findedIndex, 1);
}
listBasketItems();
};
const decreaseItemToBasket=(bookId)=>{
  const findedIndex =basketList.findIndex(basket => basket.product.id==bookId);
  if(findedIndex!=-1){
    if(basketList[findedIndex].qauntity !=1 )
    basketList[findedIndex].qauntity -=1;
  else removeItemToBasket(bookId);
listBasketItems();
  }
};
const increaseItemToBasket=(bookId)=>{
  const findedIndex =basketList.findIndex(basket => basket.product.id==bookId);
  if(findedIndex!=-1){
    if(basketList[findedIndex].qauntity !=basketList[findedIndex].product.stock)
    basketList[findedIndex].qauntity +=1;
  else 
  alert("yeterli stok yok")
  listBasketItems();
  }
};
if(localStorage.getItem( "basketList")){
  basketList=JSON.parse(localStorage .getItem("basketList"));
  listBasketItems();
}
setTimeout(()=>{
createBookItemsHtml();
createBookTypesHtml();
},100)