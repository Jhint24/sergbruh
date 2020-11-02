Super simple script for scraping RL tracker API data.

Expects a spreadsheet in the format:

| Platform       | Player     | 
| :-------------: | :----------: | 
| steam | AMustyCow   | 
| steam | rizzo | 

Caveats:

- `fetchMMR` is only set up to pull from Steam at the moment.
- No error handling, retrying, caching, etc.
- Fetching MMR can take a second or so. Should not run this consistently on more than a few accounts at a time.