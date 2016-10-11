class Factory {
  constructor() {
    this.connectionPool = [];
    this.list = [];
  }

  addListener(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    this.connectionPool.push(res);

    req.connection.addListener("close", () => {
      this.list.splice(this.list.indexOf(res), 1);
    }, false);
    console.log('new!!');
  }

  add() {
    const id = parseInt(Math.random() * 999999999);

    const randomSticky = { id, title: `Bonjour ${id}` };
    this.list.push(randomSticky);

    const action = { type: 'add', data: randomSticky };
    this.broadcast(action);
    console.log('add!!');
  }

  delete() {
    const action = { type: 'delete', data: this.list.pop() };
    this.broadcast(action);
    console.log('delete!!');
  }

  update() {
    const idx = parseInt(Math.random() * this.list.length);
    const sticky = this.list[idx];
    const time = new Date();
    sticky.title = `Updated at : ${time.getHours()} :  ${time.getMinutes()} : ${time.getSeconds()}`;

    const action = { type: 'update', data: sticky };
    this.broadcast(action);
    console.log('update!!');
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.connectionPool.forEach((res) => {
      res.write("data:" + data + "\n\n");
    });
  }


}


module.exports = new Factory();