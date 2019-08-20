import React from 'react';

export default class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            name:'chenlike',
            index:1
        }
    }

    componentDidMount() {
        // console.log(qqqqqqqqqqqqqqq)
    }

    qq(){
        // alert(1111111111111)
        console.log(qqqqqqqqqqqqqqq)
    }


    render() {
        return <div>
            <button onClick={this.qq.bind(this)}>1111111111</button>
            <button>1</button>
            <img src={require('./image/11.png')} alt=""/>
        </div>
    }
}


