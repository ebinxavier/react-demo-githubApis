import React, { Component } from 'react';
import axios from 'axios'
import { Button ,FormControl,FormGroup,Grid,Col,Row,Glyphicon} from 'react-bootstrap';
import './App.css';


const Header = (props)=>{
  return(
    <h1 style={{textAlign:'center'}}>Find on GitHub</h1>

  )
}

class Card extends Component{

  repoLimit=10;
  deleteCard = (name)=>{
    this.props.removeUser(this.props.name)
  }

 render(props){
  return	(
  	
      <Grid style={{border:"2px solid #eee",borderRadius:"10px",padding:'25px',marginTop: "10px"}}>
        <Row> 
              <Button style={{float:"right"}} bsStyle="danger" onClick={this.deleteCard}><Glyphicon glyph="trash" /></Button>
              <Col xs={12} md={4}>
                    <img style={{borderRadius:'100px',width:'200px'}} src={this.props.url}/>
                    <p style={{fontSize:"30px",fontWeight:"bold"}}>{this.props.name}</p>
                    <p style={{fontStyle:"italic"}}>{this.props.company}</p>        
              </Col>

               
              <Col xs={12} md={8} style={{display:'inline-block',padding:'10px'}}>
                <p style={{fontSize:"20px",fontWeight:"bold"}}>Repositories</p>
                  <ul>
                    {this.props.repos.slice(0,this.repoLimit).map((data)=>{
                      return <li key={data}>{data}</li>
                      })
                      }
                      {/*conditional rendering*/}
                      {this.props.repos.length>this.repoLimit &&
                          <li>....</li>
                      }

                  </ul>
              </Col>
        </Row>
      </Grid>
  )
}
}

const CardList = (props)=>{
  return(
    <div>
      {props.data.map((data)=>{
      return <Card key={data.name} {...data} removeUser={props.removeUser}/>
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
      <FormGroup>
        <Grid style={{marginTop:"20px"}}>
          <Row className="show-grid">
            <Col xs={10}>
                  <FormControl type="text" placeholder="Add user" onChange={(event)=>{         
                          this.setState({user:event.target.value})
                          }}/>
            </Col>

            <Col xs={2}>
            <Button bsStyle="primary" onClick={this.handleClick}>Search User</Button>
            </Col>
          </Row>
        </Grid>
      </FormGroup>
       
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

   removeUser = (name)=>{
     console.log(name);
        for(var i in this.state.data){
          if(this.state.data[i].name == name){
            this.state.data.splice(i,1);
            console.log(this.state.data);
            this.setState({data:this.state.data});
          }
        }
   } 
  render() {
    return (
      <div>
        <div style={{position: "fixed",zIndex: "1",background: "#c6cccc",width: "100%"}}>
        <Header/>
       <SearchBox addUser={this.addUser}/>
       </div>
       <div style={{height: "128px"}}></div>
       <CardList data={this.state.data} removeUser={this.removeUser}/>
      </div>
    );
  }
}

export default App;
