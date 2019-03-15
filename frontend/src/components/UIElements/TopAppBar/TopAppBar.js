import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import logo from '../../../images/logo.png';
import { Link } from 'react-router-dom';
import Avatar from './Avatar/Avatar';
import { AppContext } from '../../../contexts/appContext';

const styles = {
  root: {
    flexGrow: 1,
    marginBottom: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

class TopAppBar extends Component {
  static contextType = AppContext;

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root} style={{marginBottom: "0", marginTop: "0"}}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.grow}>
              <Link to="/" >
                <img src={logo} style={{backgroundColor:"#90CAF9"}} alt="logo" height="40" width="150" />
              </Link>
            </div>
            <Button component={Link} to="/contents" style={{color : "white", fontSize : "1.4vh"}}>현재 스터디 목록</Button>
            <Button component={Link} to="/signup" style={{color : "white", fontSize : "1.4vh"}}>회원가입</Button>
            {this.context.state.signInInfo.status === null ? <Button style={{width:'100px'}}> </Button> : this.context.state.signInInfo.status === false ?
                (<Button component={Link} to="/signin" style={{color : "white", fontSize : "1.4vh"}}> 로그인 </Button>)
                : (<Button> <Avatar/> </Button>)}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(TopAppBar);