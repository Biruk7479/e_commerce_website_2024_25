function showSearch(): void {
    const searchBar = document.getElementById('searchBar');
  
    if (searchBar) {
      // Ensure the element exists and has a classList
      if (searchBar.classList.contains('d-none')) {
        searchBar.classList.remove('d-none');
      } else {
        searchBar.classList.add('d-none');
      }
    } else {
      console.error('Element with id "searchBar" not found');
    }
  }
  
  
  