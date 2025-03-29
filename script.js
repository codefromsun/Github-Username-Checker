
const hold=document.getElementById("search");
const check=document.getElementById("bsearch");
// Create a result paragraph to display the check result
const resultDisplay = document.getElementById("c1");
resultDisplay.textContent = "Please enter a GitHub username";
resultDisplay.style.color = "red";
check.addEventListener("click",async function(){
    const username = hold.value.trim();
    resultDisplay.innerHTML = ""; // Clear previous result
    resultDisplay.style=""; // Reset styles
    // Check if username is empty
    if (!username) {
        resultDisplay.style.color = "red";
        resultDisplay.textContent = "Please enter a GitHub username";
        return;
    }   
    
    // Clear previous result
    resultDisplay.textContent = "Checking...";
      
    function isValidUsername(username) {
        // Must not begin or end with hyphen
        if (username.startsWith('-') || username.endsWith('-')) {
            return false;
        }
        
        // Check each character in the username
        for (let i = 0; i < username.length; i++) {
            const code = username.charCodeAt(i);
            
            // Check if it's a-z, A-Z, 0-9 or hyphen
            const isLowerCase = code >= 97 && code <= 122; // a-z
            const isUpperCase = code >= 65 && code <= 90;  // A-Z
            const isDigit = code >= 48 && code <= 57;      // 0-9
            const isHyphen = code === 45;                 // hyphen
            
            if (!(isLowerCase || isUpperCase || isDigit || isHyphen)) {
                return false;
            }
            if(isHyphen && username[i + 1] === '-') {
                return false; // Two consecutive hyphens are not allowed
            }

        }
        
        // Check length (GitHub usernames are max 39 characters)
        return username.length <= 39;
    }

    // Validate username format before making API call
    if (isValidUsername(username) === false) {
        // Condition 3: Invalid username format
        resultDisplay.textContent = "Invalid username format. Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.";
        resultDisplay.style.color = "red";
        return;
    }
    
    try {
        // Fetch data from GitHub API using the entered username
        const response = await fetch(`https://api.github.com/users/${username}`);
        const rateLimit = response.headers.get('X-RateLimit-Limit');
const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
console.log(`Rate limit: ${rateLimitRemaining} / ${rateLimit} remaining`);
        if (response.status === 200) {
            // Condition 1: User exists
            // Parse the JSON response
            const userData = await response.json();
            
            // Display the complete API response as JSON
            resultDisplay.textContent = `❌Username '${username}'  is already taken on GitHub!`;
            resultDisplay.style.color = "";
            resultDisplay.style.backgroundColor = "#f8d7da"; // Light red background
            
            
            
        } else if (response.status === 404) {
            
            resultDisplay.style.backgroundColor = "#d1e7dd "; // Light green background
                // Condition 2: User doesn't exist
                resultDisplay.innerHTML = `
                    <div >
                        <p style=" color:green" class="fw-bold"><strong>User '${username}' doesn't exist on GitHub.</strong></p>
                        <p><mark>⚠️ Important Note: This doesn't necessarily mean the username is available for registration as they may have
                         additional rules that may prevent certain usernames from being registered<mark> </p>
                        <p>To check if you can register this username:</p>
                        <a href="https://github.com/signup?source=login" target="_blank" style="display: inline-block; margin-top: 5px; padding: 4px 8px; background-color: #2ea44f; color: white; text-decoration: none; border-radius: 6px;">Check on GitHub Signup</a>
                    </div>
                `;
            
        } else {
            // Handle other potential errors from the API
            resultDisplay.textContent = `Error: ${response.status} ${response.statusText}`;
            resultDisplay.style.color = "orange";
        }
    } catch (error) {
        // Handle network errors or other exceptions
        resultDisplay.textContent = `Error: ${error.message}`;
        resultDisplay.style.color = "red";
    }

})// Function to validate GitHub username format

