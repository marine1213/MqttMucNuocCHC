function autocomplete(inp, arr, onItemClicked, params) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, inputValue = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      var lastCommaIdx=inputValue.lastIndexOf(', ')+2;
      var focusedVal=(lastCommaIdx>1)?inputValue.substring(lastCommaIdx):inputValue;
      var remainVal=(lastCommaIdx>1)?inputValue.substring(0,lastCommaIdx):'';

      currentFocus = -1;
      if (!focusedVal) { return false;}
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      a.setAttribute("style", "width:"+this.offsetWidth+'px');
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        var startIdx=arr[i].toUpperCase().indexOf(focusedVal.toUpperCase());
        if(startIdx > -1){
        // if (arr[i].substr(startIdx, startIdx+val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            var endIdx=startIdx+focusedVal.length;
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = arr[i].substring(0,startIdx);
            b.innerHTML += "<strong>" + arr[i].substring(startIdx, endIdx) + "</strong>";
            b.innerHTML += arr[i].substring(endIdx);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + i + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              var idx=parseInt(this.getElementsByTagName("input")[0].value);
              inp.value = remainVal+arr[idx];
              
              if(onItemClicked) onItemClicked(inp,arr,idx,params);
              else{
                var nextElm=inp.nextElementSibling, hiddenInput, savedValue;
                addNewElm=()=>{var nElm=document.createElement("input");nElm.type='hidden'; inp.parentNode.appendChild(nElm);return nElm}
                if(nextElm.value!=undefined) {savedValue=JSON.parse(nextElm.value);hiddenInput=nextElm;}else{savedValue=[];hiddenInput=addNewElm()}
                savedValue.push(idx);hiddenInput.value=JSON.stringify(savedValue);
              }
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
            });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {

      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  document.addEventListener("onresize", function (e) {
      closeAllLists(e.target);
  });

}

