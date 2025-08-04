# My Learning Blog
"My Learning Blog" is the blog where I will put all the things that I am not ashamed of sharing that I have learned. So I thought that I could easily find easy javascript program that do things exactly the way I wanted. But Either what i find is too complicated or just not cutting it good enough. So I will have to make the full program by myself.

So, My requirements are - 
1. Must be able to render math equations
2. Must have a consistent theme or reflexive theme that is decent in all devices
3. must have a tag system
4. must have a category system
5. Use markdown to write blogs instead of html - probably use json to store the note in the first place and then render it.


Things that I have figured out
1. How to syntax highlight with code copy button 
2. How to render an equation
3. Basic design of the webpage
4. Inline equations are not rendering the library i used prints equations in a separate line at the center of container.
5. Theme design configuration in the webpage
6. Theme toggling


Things that are causing problems
1. I still do not know if DOM manipulated data gets rerendered to the syntax highlight and math parsing or not

Things not tried yet
1. tag, category and markdown parsing system
2. Syntax setup - the structure of the contents
3. Designing the output setup for the contents

There is an idea to make the categories the directory and the tags connected to the page metadata. I need to find a way to store tags in page so that I can render the page without making a mess of tags. But currently the Idea That I have does not facilitate static pages. all the pages will be rendered in the index page with js DOM data manipulation. I may need to know if that will cause problems or not.

The current experimental build is online at [github pages URL](https://sadman-ishtiak.github.io/My-Learning-Blog/)