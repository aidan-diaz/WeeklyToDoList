var leftArrow = document.getElementsByClassName("bi-arrow-left-square-fill");
var rightArrow = document.getElementsByClassName("bi-arrow-right-square-fill");
var trash = document.getElementsByClassName("bi-trash-fill");

Array.from(leftArrow).forEach(function(element) {
  element.addEventListener('click', function(){
    const task = this.parentNode.parentNode.childNodes[1].innerText
    const day = this.parentNode.parentNode.childNodes[3].innerText.trim().toLowerCase()

    fetch('moveLeft', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'task': task,
        'day': day
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(rightArrow).forEach(function(element) {
      element.addEventListener('click', function(){
        const task = this.parentNode.parentNode.childNodes[1].innerText
        const day = this.parentNode.parentNode.childNodes[3].innerText.trim().toLowerCase()

        fetch('moveRight', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'task': task,
            'day': day
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        console.log('deleting...')
        const task = this.parentNode.parentNode.childNodes[1].innerText
        const day = this.parentNode.parentNode.childNodes[3].innerText.trim().toLowerCase()
        console.log(day)
        console.log(task)
        fetch('deleteTask', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'task': task,
            'day': day
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

