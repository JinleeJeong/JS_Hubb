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
  button: {
    fontSize: 17,
  },
};

class TopAppBar extends Component {
  static contextType = AppContext;

  render() {
    const { classes } = this.props;
    
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.grow}>
              <Link to="/templates" >
                <img src={logo} color="inherit" alt="logo" height="40" width="150" />
              </Link>
            </div>
            <Button className={classes.button} component={Link} to="/templates" color="inherit">현재 스터디 목록</Button>
            <Button className={classes.button} component={Link} to="/signup" color="inherit">회원가입</Button>
            {this.context.state.signInInfo.status === null ? <Button style={{width:'100px'}}> </Button> : this.context.state.signInInfo.status === false ?
                (<Button className={classes.button} component={Link} to="/signin" color="inherit"> 로그인 </Button>)
                : (<Button> <Avatar/> </Button>)}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(TopAppBar);