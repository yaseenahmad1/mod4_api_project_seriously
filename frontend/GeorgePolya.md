Game plan from this point: 

We created the sign up form (needs css)
We created the login form (needs css)
We created a spots landing page (needs css)
We created a spot details page (needs css)


We need to create : 

SPOTS
--------
1. A "Create a Spot" button that will appear next to the hamburger dropdown menu which will appear only when an owner is logged in 
2. When a user is signed in that owns the properties they should be able to access their spots based on the foreignkey in spots table that links to owner id 
3. There needs to be a button that says "manage" and "delete" under each spot so that when use clicks on manage edit form appears and if they hit delete then a pop up of "are you sure you want to delete" appears and then upon hitting that button implements the api endpoint 

REVIEWS
----------
1. Reviews List of reviews pertaining to a particular spot with the stars and num of reviews provided
2. "Create a Review" for a spot that will pop up on the page we are on to fill in textbox of review and the star rating
- Need a "post your review" button under the spot/:id page that has a specific spot 
3. "Edit a Review" a user who owns that review for the spot can sign in and edit their review and stars 
4. "Delete a Review" a user should be able to click the delete button under their review and delete the review 


