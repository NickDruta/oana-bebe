export const translateText = async (data: string) => {
  let fromLang = "ro";
  let toLang = "ru"; 
  let ruText:any = '';

  const API_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;

  let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  url += "&q=" + encodeURI(data);
  url += `&source=${fromLang}`;
  url += `&target=${toLang}`;

  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      ruText = response;
    })
    .catch((error) => {
      console.log("There was an error with the translation request: ", error);
    });

    return ruText;
};
