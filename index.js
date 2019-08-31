/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default class Paystack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  Paystack = {
    html: `  
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh ">
          <script src="https://js.paystack.co/v1/inline.js"></script>
          <script type="text/javascript">
            window.onload = payWithPaystack;
            function payWithPaystack(){
            var handler = PaystackPop.setup({ 
              key: '${this.props.paystackKey}',
              email: '${this.props.billingEmail}',
              amount: ${this.props.amount}00,
              currency: "NGN",
              ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
              metadata: {
                custom_fields: [{
                  display_name:  '${this.props.billingName}',
                  variable_name:  '${this.props.billingName}',
                  value:''
                }]
              },
              callback: function(response){
                var resp = {event:'successful', transactionRef:response.reference};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
              },
              onClose: function(){
                var resp = {event:'cancelled'};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
              }
              });
              handler.openIframe();
            }
          </script> 
        </body>
      </html> 
      `
  };

  messageRecived = data => {
    var webResponse = JSON.parse(data);
    switch (webResponse.event) {
      case "cancelled":
        this.props.onCancel();
        break;

      case "successful":
        this.props.onSuccess(webResponse.transactionRef);
        break;

      default:
        this.props.onCancel();
        break;
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          originWhitelist={["*"]}
          ref={webView => (this.MyWebView = webView)}
          source={this.Paystack}
          onMessage={e => {
            this.messageRecived(e.nativeEvent.data);
          }}
        />
      </View>
    );
  }
}

Paystack.defaultProps = {
  amount: 10
};
