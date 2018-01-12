import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

const Card = (props)=>{
  const repoLimit=10;
  return	(
  	<div style={{border:"2px solid #eee",borderRadius:"10px"}}>
    <img style={{padding:'10px',marginTop: '-50px',borderRadius:'100px',width:'100px'}} src={props.url}/>
      <div style={{display:'inline-block',padding:'10px'}}>
				<p style={{fontSize:"30px",fontWeight:"bold"}}>{props.name}</p>
        <p style={{fontStyle:"italic"}}>{props.company}</p>
        <p style={{fontSize:"20px",fontWeight:"bold"}}>Repositories</p>
          <ul>
            {props.repos.slice(0,repoLimit).map((data)=>{
              return <li key={data}>{data}</li>
              })
              }
              {/*conditional rendering*/}
              {props.repos.length>repoLimit &&
                  <li>....</li>
              }

          </ul>
      </div>
    </div>
  )
}

const CardList = (props)=>{
  return(
    <div>
      {props.data.map((data)=>{
      return <Card key={data.name} {...data}/>
      })}
      
    </div>
  )
}

class SearchBox extends Component{
  handleClick = (event)=>{
    console.log(this.state.user);
    this.props.addUser(this.state.user);
  }
  state = {user:""}
  render(){
    return (
      <div>
        <input type="text" placeholder="Add user" onChange={(event)=>{         
          this.setState({user:event.target.value})
        }}/>
        <button onClick={this.handleClick}>Click Me</button>
      </div>
    )
  }

}



class App extends Component {
  state = {
    data:[],
    tempObj:{}
				}

    addUser = (user)=>{

axios.get('https://api.github.com/users/'+user)
.then(userResponse=>{
  // console.log(userResponse)
  this.setState(prevState=>{
    prevState.tempObj.url=userResponse.data.avatar_url;
    prevState.tempObj.name=userResponse.data.login;
    prevState.tempObj.company=userResponse.data.company==null?"Not Specified":userResponse.data.company;
    return {tempObj:prevState.tempObj};
  })

 axios.get('https://api.github.com/users/'+user+'/repos')
    .then(response => {
      // this.setState(response.data)
      let repo=[];
      response.data.map(val=>{
        repo.push(val.name);
      })
       this.setState((prevState)=>{
      console.log(prevState);
        prevState.tempObj.repos=repo;
        prevState.data.push(prevState.tempObj);
        prevState.tempObj={};

       return {data:prevState.data}
      });

    }).catch(err=>{console.log(err)})
}).catch(err=>{console.log(err)})

    }
  render() {
    return (
      <div>
       <CardList data={this.state.data}/>
       <SearchBox addUser={this.addUser}/>
      </div>
    );
  }
}

export default App;
