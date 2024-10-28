import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Tabs, 
  Tab, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Menu as MenuIcon, 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Save as SaveIcon, 
  PlayArrow as PlayArrowIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  methodSelect: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  table: {
    minWidth: 650,
  },
  jsonEditor: {
    fontFamily: 'monospace',
    width: '100%',
    minHeight: 200,
  },
}));

const MethodSelect = ({ value, onChange }) => {
  const classes = useStyles();
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={classes.methodSelect}
    >
      {methods.map((method) => (
        <MenuItem key={method} value={method}>
          {method}
        </MenuItem>
      ))}
    </Select>
  );
};

const ParameterTable = ({ parameters, onParameterChange, onParameterDelete, onParameterAdd }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="parameter table">
        <TableHead>
          <TableRow>
            <TableCell>参数名</TableCell>
            <TableCell>类型</TableCell>
            <TableCell>必填</TableCell>
            <TableCell>说明</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameters.map((param, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={param.name}
                  onChange={(e) => onParameterChange(index, { ...param, name: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={param.type}
                  onChange={(e) => onParameterChange(index, { ...param, type: e.target.value })}
                >
                  {['string', 'number', 'boolean', 'array', 'object'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Switch
                  checked={param.required}
                  onChange={(e) => onParameterChange(index, { ...param, required: e.target.checked })}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={param.description}
                  onChange={(e) => onParameterChange(index, { ...param, description: e.target.value })}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onParameterDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        startIcon={<AddIcon />}
        onClick={onParameterAdd}
        color="primary"
      >
        添加参数
      </Button>
    </TableContainer>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default function Component() {
  const classes = useStyles();
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/pet/{petId}');
  const [activeTab, setActiveTab] = useState(0);
  const [parameters, setParameters] = useState([
    { name: 'name', type: 'string', required: true, description: '宠物名称' },
    { name: 'status', type: 'string', required: false, description: '状态' }
  ]);
  const [headers, setHeaders] = useState([
    { name: 'Content-Type', type: 'string', required: true, description: 'application/json' }
  ]);
  const [bodyContent, setBodyContent] = useState('{\n  "name": "doggie",\n  "status": "available"\n}');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#303030' : '#fafafa';
    document.body.style.color = isDarkMode ? '#ffffff' : '#000000';
  }, [isDarkMode]);

  const handleParameterChange = (index, updatedParameter) => {
    const newParameters = [...parameters];
    newParameters[index] = updatedParameter;
    setParameters(newParameters);
  };

  const handleParameterDelete = (index) => {
    const newParameters = parameters.filter((_, i) => i !== index);
    setParameters(newParameters);
  };

  const handleParameterAdd = () => {
    setParameters([
      ...parameters,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  };

  const handleHeaderChange = (index, updatedHeader) => {
    const newHeaders = [...headers];
    newHeaders[index] = updatedHeader;
    setHeaders(newHeaders);
  };

  const handleHeaderDelete = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleHeaderAdd = () => {
    setHeaders([
      ...headers,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  };

  const handleSave = () => {
    alert('API 已保存');
  };

  const handleRun = () => {
    alert('API 运行中...');
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            API 文档
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                color="default"
              />
            }
            label={isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button>
              <ListItemIcon><MenuIcon /></ListItemIcon>
              <ListItemText primary="项目概览" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><MenuIcon /></ListItemIcon>
              <ListItemText primary="接口" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          查询宠物详情
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <MethodSelect value={method} onChange={setMethod} />
          <TextField
            value={path}
            onChange={(e) => setPath(e.target.value)}
            style={{ marginLeft: '10px', flexGrow: 1 }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} style={{ marginRight: '10px' }}>
            保存
          </Button>
          <Button variant="contained" color="secondary" startIcon={<PlayArrowIcon />} onClick={handleRun}>
            运行
          </Button>
        </div>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} aria-label="api tabs">
          <Tab label="参数" />
          <Tab label="Header" />
          <Tab label="Body" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <ParameterTable
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onParameterDelete={handleParameterDelete}
            onParameterAdd={handleParameterAdd}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ParameterTable
            parameters={headers}
            onParameterChange={handleHeaderChange}
            onParameterDelete={handleHeaderDelete}
            onParameterAdd={handleHeaderAdd}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ParameterTable
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onParameterDelete={handleParameterDelete}
            onParameterAdd={handleParameterAdd}
          />
          <TextField
            multiline
            rows={10}
            variant="outlined"
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            className={classes.jsonEditor}
            label="JSON Body"
            margin="normal"
          />
        </TabPanel>
      </main>
    </div>
  );
}
