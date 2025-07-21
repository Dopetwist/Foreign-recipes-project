import express, { Route } from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

const API_URL = "https://themealdb.com/api/json/v1/1/";


// Middlewares.
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));


// The Home route that uses two URLs to display different Meals.
app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "random.php");
        const result2 = await axios.get(API_URL + "lookup.php?i=52945");

        res.render("index.ejs", {apiData: result.data, staticMeal: result2.data});
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("index.ejs", { message: "No meal data available to display!", apiData: null, staticMeal: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("index.ejs", { message: "Something went wrong while fetching meal images, please try again later.", apiData: null, staticMeal: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("index.ejs", { message: "An error occured, please try again!" });
        }
    }
});


// Rendering the search page where a user searches for a recipe using it's name.
app.get("/name-search", (req, res) => {
    try {
        res.render("search1.ejs");
    } catch (error) {
        console.error("Error:", error.message);
        res.render("search1.ejs", { message: "An error occured, please try again!" });
    }
});


// This route takes the user input and displays the exact meal details accessed from the API data.
app.post("/display-search1", async (req, res) => {

    const { currentPage, category, area } = req.query;

    const userInput = req.body.input;

    // Error handling message if user sends an empty input field request.
    if (!userInput) {
        return res.render("search1.ejs", { message: "Error: Input is required!", apiData: null});
    }

    try {
        const result = await axios.get(API_URL + "search.php?s=" + userInput, { 
            params: { userInput }
        });
        const apiData = result.data;

        console.log(apiData);

        // When there is no search result, this error message will be rendered.
        if (!apiData.meals) {
            return res.render("display1.ejs", { message: "No meal data available for your search!", apiData: null, currentPage, category, area });
        }

        // When a search result is available, this will be rendered.
        res.render("display1.ejs", { message: null, apiData, currentPage, category, area });
    } catch (error) {
        // This error triggers when the error response status code from the API is outside 2xx range.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("display1.ejs", { message: "No data available for your search!", apiData: null, currentPage, category, area });

        // This error triggers when a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("display1.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null, currentPage, category, area });

        // This aspect handles any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("display1.ejs", { message: "An error occured, please try again.", apiData: null, currentPage, category, area });
        }
    }
});


// Renders the search page where the user inputs an alphabet for recipes search.
app.get("/letter-search", (req, res) => {
    try {
        res.render("search2.ejs");
    } catch (error) {
        console.error("Error:", error.message);
        res.render("search2.ejs", { message: "An error occured, please try again!" });
    }
});


// This route displays all the recipes of a particular alphabet searched by a user.
app.post("/display-search2", async (req, res) => {

    const { currentPage, category, area } = req.query;

    const userInput = req.body.input;

    // Error handling message if user sends an empty input field request.
    if (!userInput) {
        return res.render("search2.ejs", { message: "Error: Input is required!", apiData: null});
    }

    try {
        
        const result = await axios.get(API_URL + "search.php?f=" + userInput, {
            params: { userInput }
        });
        const apiData = result.data;

        console.log(apiData);

        // When there is no search result, this error message will be rendered.
        if (!apiData.meals) {
            return res.render("recipes.ejs", { message: "No meal data available for your search!", apiData: null, currentPage, category, area });
        }

        // When a search result is available, this will be rendered.
        res.render("recipes.ejs", { message: null, apiData, currentPage, category, area });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("recipes.ejs", { message: "No meal data available for your search!", apiData: null, currentPage, category, area });

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("recipes.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null, currentPage, category, area });

        // Error handling for any other unexpected and unforeseen errors
        } else {
            console.error("Error:", error.message);
            res.render("recipes.ejs", { message: "An error occured, please try again.", apiData: null, currentPage, category, area });
        }
    }
});


// Look-up the recipe's details from the API and displays it's relevant data.
app.get("/meal/:idMeal", async (req, res) => {
    try {
        const { currentPage, category, area } = req.query;
        const uniqueID = req.params.idMeal;
        const result = await axios.get(API_URL + "lookup.php?i=" + uniqueID);
        const apiData = result.data;

        res.render("display1.ejs", { apiData, currentPage, category, area });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("display1.ejs", { message: "No meal data available for your search!", apiData: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("display1.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("display1.ejs", { message: "An error occured, please try again.", apiData: null });
        }
    }
});


// Listing all the categories of the recipes.
app.get("/category-search", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "list.php?c=list");
        console.log(result.data);
        res.render("search3.ejs", {apiData: result.data});
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("search3.ejs", { message: "No category available to display!", apiData: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("search3.ejs", { message: "Something went wrong while fetching data, please try again later!", apiData: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("search3.ejs", { message: "An error occured, please try again!", apiData: null });
        }
    }
});


// Displaying all the recipes in a particular category selected by the user.
app.get("/category/:strCategory", async (req, res) => {
    try {
        const category = req.params.strCategory;
        const result = await axios.get(API_URL + "filter.php?c=" + category);
        const apiData = result.data;

        res.render("recipes.ejs", { apiData, category });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("recipes.ejs", { message: "No category available to display!", apiData: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("recipes.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("recipes.ejs", { message: "An error occured, please try again.", apiData: null });
        }
    }
});


// This Route lists all the areas of the recipes.
app.get("/area-search", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "list.php?a=list");
        const apiData = result.data;

        console.log(apiData);

        res.render("search4.ejs", { apiData });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("search4.ejs", { message: "No Area available to display!", apiData: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("search4.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("search4.ejs", { message: "An error occured, please try again.", apiData: null });
        }
    }
});


// Filtering and displaying all recipes of a particular area.
app.get("/area/:strArea", async (req, res) => {
    try {
        const area = req.params.strArea;
        const result = await axios.get(API_URL + "filter.php?a=" + area);
        const apiData = result.data;

        res.render("recipes.ejs", { apiData, area });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("recipes.ejs", { message: "No Area available to display!", apiData: null});

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("recipes.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("recipes.ejs", { message: "An error occured, please try again.", apiData: null });
        }
    }
});


// A random meal is displayed each time this route is triggered and rendered.
app.get("/random-search", async (req, res) => {
    try {

        const { currentPage, category, area } = req.query;

        const esult = await axios.get(API_URL + "random.php");
        const apiData = result.data;


        res.render("display1.ejs", { apiData, currentPage, category, area });
    } catch (error) {
        // Error handling if the API responds with a non-2xx status code.
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            res.render("display1.ejs", { message: "No random meal available to display!", apiData: null, currentPage, category, area });

        // Error handling if a request was made but the API didn't respond.
        } else if (error.request) {
            console.error("The API is not responding:", error.request);
            res.render("display1.ejs", { message: "Something went wrong while fetching data, please try again later.", apiData: null, currentPage, category, area });

        // Error handling for any other unexpected and unforeseen errors.
        } else {
            console.error("Error:", error.message);
            res.render("display1.ejs", { message: "An error occured, please try again.", apiData: null, currentPage: null, category: null, area: null });
        }
    }
});


// Running and activating the Server.
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
