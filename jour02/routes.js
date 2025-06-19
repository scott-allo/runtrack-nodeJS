const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function handleRoutes(req, res) {
  const { method, url } = req;
  const baseUrl = url.split('?')[0];

  // GET /tasks
  if (method === 'GET' && baseUrl === '/tasks') {
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }

  // POST /tasks
  else if (method === 'POST' && baseUrl === '/tasks') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newTask = JSON.parse(body);
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
        const tasks = JSON.parse(data).tasks;
        newTask.id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        tasks.push(newTask);
        fs.writeFile(dataPath, JSON.stringify({ tasks }, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newTask));
        });
      });
    });
  }

  // PUT /tasks/:id
  else if (method === 'PUT' && baseUrl.startsWith('/tasks/')) {
    const id = parseInt(baseUrl.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedTask = JSON.parse(body);
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
        let tasks = JSON.parse(data).tasks;
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Task not found' }));
          return;
        }
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
        fs.writeFile(dataPath, JSON.stringify({ tasks }, null, 2), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tasks[taskIndex]));
        });
      });
    });
  }

  // DELETE /tasks/:id
  else if (method === 'DELETE' && baseUrl.startsWith('/tasks/')) {
    const id = parseInt(baseUrl.split('/')[2]);
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
      let tasks = JSON.parse(data).tasks;
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Task not found' }));
        return;
      }
      const deletedTask = tasks.splice(taskIndex, 1);
      fs.writeFile(dataPath, JSON.stringify({ tasks }, null, 2), (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedTask[0]));
      });
    });
  }

  // Route non trouvée
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
}

module.exports = handleRoutes;