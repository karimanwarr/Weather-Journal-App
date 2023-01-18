// Base URL and API Key for OpenWeatherMap API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

const apiKey = '&appid=539e67e256d7763f0f77bfbdb76fd960';

// Creating a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


// the URL of the server to post data
const server = "http://127.0.0.1:4000";

// showing the error to the user
const error = document.getElementById("error");


const generateData = () => { 
  //get value after click on the button
  const zip = document.getElementById("zip").value;
  const feel = document.getElementById("feelings").value;

  // getWeatherData return promise
  getWeatherData(zip).then((data) => {
    //making sure from the received data to execute rest of the steps
    if (data) {
      const {
        main: { temp },
      } = data;

      const info = {
        newDate,
        temp: Math.round(temp),
        feel,
      };

      postData(server + "/add", info);                    

    }
  });
};

// Event listener to add function to existing HTML DOM element
// Function called by event listener
document.getElementById("generate").addEventListener("click", generateData);

//Function to GET Web API Data
const getWeatherData = async (zip) => {
  try {
    const res = await fetch(baseURL + zip + apiKey);
    const data = await res.json();

    if (data.cod != 200) {
      // display the error message on UI
      error.innerHTML = data.message;
      setTimeout(_=> error.innerHTML = '', 2000)
      throw `${data.message}`;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Function to POST data
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(info),
  });

  try {
    const newData = await res.json();
    console.log(`You just saved`, newData);
    return newData;
  } catch (error) {
    console.log(error);
  }
};

//Function to GET Project Data
// and updating UI by this data
const updatingUI = async () => {
  const res = await fetch(server + "/all");
  try {
    const allData = await res.json();
    document.getElementById("temp").innerHTML = allData.temp + '&degC';
    document.getElementById("date").innerHTML = allData.newDate;
    document.getElementById("content").innerHTML = allData.feel;
  } 
  catch (error) {
    console.log(error);
    // appropriately handle the error
  }
};