const comicForm = document.getElementById('comicForm');
const comicDisplay = document.getElementById('comicDisplay');
const errorMessage = document.getElementById('errorMessage');
const loadingElement = document.getElementById('loading');

const apiKey = 'VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM';
const apiUrl = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';

comicForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    errorMessage.innerText = '';
    loadingElement.style.display = 'flex';

    const panels = [];
    for (let i = 1; i <= 10; i++) {
        const panelText = document.getElementById(`panel${i}`).value.trim();
        panels.push(panelText);
    }

    try {
        const results = await callApi(panels);
        console.log(results);
        displayComic(results);
    } catch (error) {
        console.error('Error generating comic:', error);
        errorMessage.innerText = 'Failed to generate comic. Please try again.';
    } finally {
        loadingElement.style.display = 'none';
    }
});

async function callApi(panels) {
    const results = [];

    for (const panelText of panels) {
        console.log(panelText);
        try {
            const responsePromise = fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'image/png',
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "inputs": panelText,
                }),
            });

            const response = await responsePromise;
            const resultBlob = await response.blob();
            results.push(resultBlob);
        } catch (error) {
            console.error(`Error querying API for panel: ${panelText}`, error);
            errorMessage.innerText = 'Failed to generate comic. Please try again.';
        }
    }

    return Promise.resolve(results);
}

async function displayComic(results) {
  comicDisplay.innerHTML = '';

  const imagePromises = results.map((resultBlob, i) => {
    const reader = new FileReader();
    const promise = new Promise((resolve) => {
      reader.onloadend = () => {
        const img = document.createElement('img');
        img.src = reader.result;
        img.alt = `Panel ${i + 1}`;
        comicDisplay.appendChild(img);
        resolve();
      };
    });
    reader.readAsDataURL(resultBlob);
    return promise;
  });

  await Promise.all(imagePromises);
}

const toggleIcon = document.querySelector('.toggle-icon');

toggleIcon.addEventListener('click', () => {
    toggleIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
});