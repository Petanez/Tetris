TETRIS

DD,MM,YYYY
09/11/2020
-----------------------------------------------------------------------------------------
ABOUT MAKING THE PROJECT
-----------------------------------------------------------------------------------------
This is the first solo project i've made with JavaScript and it took me a week to make.
It might not be the most elegant solution but im happy how it turned out.
Every part of the solution i came up on my own. 

I started this project by making the grid for the board and drawing it.

After that i made a class for the square and for the 2x2 square piece, then a way to draw
just the single square and combine it to draw the whole piece.
Once i had one piece worked out i started playing around with the interval 
and made the function to lower the piece until one of the squares had reached last row of the board
or one of the squares was occupied and then returning to the previous (x, y) coordinates & locking it.

Once i could play around with the interval i added the eventlisteners for keypresses and made a function to move the piece
in each direction using the same principle to lock the piece as with lowering the piece.

Then i made a "L" piece and started figuring out how to rotate the pieces (For me this was by far the hardest 
part of the project and i circled back to it multiple times the last of which was
after i had gotten all the other mechanics working) 

After the first time giving up on figuring out the rotation i started adding pieces
and some HTML/CSS to make the "UI". 

Then i tried to work out the rotation again and failed -> added the rest of the pieces and worked some more on the design
meanwhile fixing bugs and adding lines of code here and there + removing the full rows.

The next day i finally managed to break down the problem of rotating the pieces by visualizing it on a notebook 
(for some this is childs play, but i was excited to've figured it out).

After that the rest of the project was easy to finish, with the minor exception of having a bug on the GAME OVER text effect
(im still not 100% sure how i fixed it and, due to its rarity, if i fixed it), i finished by working out the kinks, 
adding the scoring system, trying out different intervals to increment the levels and adding visual effects.


I had alot of fun making this project and practising my JS/Developer skills



-----------------------------------------------------------------------------------------------------
NOTES
-----------------------------------------------------------------------------------------------------
I made this project to practise my JavaScript skills, i've no intention to upload it anywhere since i do not own the rights to this game.

