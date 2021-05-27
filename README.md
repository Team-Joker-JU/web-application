# Web application

## Dependencies
<table border=1>
    <tr>
        <th>
            Name
        </th>
        <th>
            Description
        </th>
        <th>
            Homepage for org.
        </th>
    </tr>
    <tr>
        <td>Node.js</td>
        <td>Environment to run javascript applications</td>
        <td>https://nodejs.org/en/</td>
    </tr>
    <tr>
        <td>npm</td>
        <td>Node packet manager. Handles installation for every techonology within node applications</td>
        <td>https://www.npmjs.com/</td>
    </tr>
</table>

## Description
Reads from the backend API and gets the mowers coordinates. With these coordinates we draw a map over the route the mower has traveled, if there is a collision this is marked on the map.

## Technologies
* express
* express-handlebars
* nodemon

## Installation
1. `git clone https://github.com/Team-Joker-JU/web-application.git`
2. `npm install`
3. `nodemon main.js`
