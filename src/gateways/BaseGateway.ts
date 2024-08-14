class BaseGateway {
  get host() {
    return process.env.GRPC_URL || '0.0.0.0:50051';
  }

  public async Setup() {
    return new Promise((resolve, reject) => {});
  }

  public RegisterGateway(socketClient: any) {
    // Register gateway logic here
  }

  public RegisterSocket(socketClient: any) {
    // Register socket logic here
  }

  // protected registerSocketEvent(socketClient, event: string, grpcCall, callback = null) {
  //   socketClient.on(event, (params, socketCallback) => {
  //     this.log(`request [${event}]`);

  //     grpcCall(
  //       params,
  //       {
  //         deadline: Date.now() + 10000,
  //       },
  //       (err, response) => {
  //         this.log(`response [${event}] ${err}`);

  //         if (err) {
  //           response = {
  //             status: 'error',
  //             message: err.message,
  //           };

  //           this.log(err);

  //           socketCallback(response);

  //           return;
  //         }

  //         response = Object.assign(response.response || {}, {
  //           status: 'success',
  //         });

  //         // console.log(logs);
  //         if (callback) {
  //           callback(response);
  //         }
  //         console.log('event', event, 'params', params, 'socketCallback', socketCallback);
  //         socketCallback(response); // return socket response
  //       }
  //     );
  //   });
  // }

  protected registerSocketEvent(client, event: string, handler) {
    client.on(event, (params, callback) => {
      let logs = '';
      logs += '--------------------------' + '\n';
      logs += new Date() + '\n';

      logs += `[${event}]\n${JSON.stringify(params)} callback ${callback}` + '\n';

      handler(params, (err, response) => {
        if (err) {
          response = {
            status: 'error',
            message: err.message,
          };

          logs += `${err}` + '\n';
          logs += '--------------------------' + '\n';

          console.log(logs);
          if (callback) {
            callback(response);
          }

          return;
        }

        response = Object.assign(response || {}, {
          status: 'success',
        });

        logs += JSON.stringify(response) + '\n';
        logs += '--------------------------' + '\n';

        console.log(logs);
        if (callback) {
          callback(response);
        }
      });
    });
  }

  private log(message: string) {
    console.log(`[${new Date()}]${message}`);
  }
}

export default BaseGateway;
