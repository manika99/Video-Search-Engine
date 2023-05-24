const cxId = `952a5ad4307b542ce`; // Replace with your CX ID (Search engine ID)
      let startIndex = 1; // Starting index for search results
      let currentPage = 1; // Current page number
      let totalResults = 0; // Total number of search results

      const searchForm = document.getElementById('search-form');
      const searchInput = document.getElementById('search-input');
      const resultsContainer = document.getElementById('results');
      const prevButton = document.getElementById('prev-btn');
      const nextButton = document.getElementById('next-btn');
      const previewOverlay = document.getElementById('preview-overlay');
      const visitButton = document.getElementById('visit-btn');
      const closeButton = document.getElementById('close-btn');
      let currentVideoUrl = '';

      // Function to perform video search
      function searchVideos(query) {
        const url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDEQ3g-HOBW2vK0rxTWv2eBSkWyAlT5NUw&cx=${cxId}&q=${query}&start=${startIndex}&num=10&siteSearch=youtube.com`;
        // Replace YOUR_API_KEY with your actual API key (Note: You need a valid API key to make requests to the Custom Search JSON API)

        fetch(url)
          .then(response => response.json())
          .then(data => {
            totalResults = parseInt(data.searchInformation.totalResults);
            displayResults(data.items);
            updatePagination();
          })
          .catch(error => {
            console.log('Error:', error);
          });
      }

      // Function to display video results
      function displayResults(items) {
        resultsContainer.innerHTML = '';

        items.forEach(item => {
          if (!item.link.includes('youtube.com')) {
            return; // Skip non-YouTube video results
          }

          const videoItem = `
            <div class="video-item">
              <img src="https://img.youtube.com/vi/${item.link.split('v=')[1]}/0.jpg" alt="${item.title}">
              <h3>${item.title}</h3>
              <h6>${item.displayLink}</h6>
            </div>
          `;

          resultsContainer.innerHTML += videoItem;

          const videoItems = document.getElementsByClassName('video-item');
          const lastIndex = videoItems.length - 1;
          const currentVideoItem = videoItems[lastIndex];

          currentVideoItem.addEventListener('click', () => {
            openPreview(item.link);
          });
        });
      }

      // Function to open video preview
      function openPreview(url) {
        currentVideoUrl = url;
        previewOverlay.style.display = 'block';
      }

      // Function to close video preview
      function closePreview() {
        previewOverlay.style.display = 'none';
        currentVideoUrl = '';
      }

      // Function to update pagination buttons
      function updatePagination() {
        if (currentPage === 1) {
          prevButton.disabled = true;
        } else {
          prevButton.disabled = false;
        }

        if (startIndex + 10 > totalResults) {
          nextButton.disabled = true;
        } else {
          nextButton.disabled = false;
        }
      }

      // Event listener for search form submission
      searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const query = searchInput.value;
        startIndex = 1;
        currentPage = 1;
        searchVideos(query);
      });

      // Event listener for previous button click
      prevButton.addEventListener('click', () => {
        startIndex -= 10;
        currentPage--;
        searchVideos(searchInput.value);
      });

      // Event listener for next button click
      nextButton.addEventListener('click', () => {
        startIndex += 10;
        currentPage++;
        searchVideos(searchInput.value);
      });

      // Event listener for visit button click in the preview overlay
      visitButton.addEventListener('click', () => {
        window.open(currentVideoUrl, '_blank');
        closePreview();
      });

      // Event listener for close button click in the preview overlay
      closeButton.addEventListener('click', () => {
        closePreview();
      });