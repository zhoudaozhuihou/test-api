import React, { useState, useCallback, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
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
  Box,
  Container,
  Grid,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Checkbox,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Upload as UploadIcon,
  Close as CloseIcon,
  RestartAlt as RestartAltIcon,
  Person as PersonIcon,
  Api as ApiIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#FF0000',
    },
  },
});

const StyledMethodSelect = styled(Select)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

const StyledJsonEditor = styled(TextField)(({ theme }) => ({
  fontFamily: 'monospace',
  width: '100%',
  minHeight: 200,
}));

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: 400,
  overflow: 'auto',
});

const DropZone = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function MethodSelect({ value, onChange }) {
  const methods = [
    { value: 'GET', color: '#61affe' },
    { value: 'POST', color: '#49cc90' },
    { value: 'PUT', color: '#fca130' },
    { value: 'DELETE', color: '#f93e3e' },
    { value: 'PATCH', color: '#50e3c2' }
  ];

  return (
    <StyledMethodSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {methods.map((method) => (
        <MenuItem key={method.value} value={method.value} style={{ color: method.color }}>
          {method.value}
        </MenuItem>
      ))}
    </StyledMethodSelect>
  );
}

function ParameterTable({ parameters, onParameterChange, onParameterDelete, onParameterAdd, setSnackbar }) {
  return (
    <ScrollableTableContainer component={Paper}>
      <Table stickyHeader aria-label="parameter table">
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
                  fullWidth
                  value={param.name}
                  onChange={(e) => onParameterChange(index, { ...param, name: e.target.value })}
                  error={!param.name}
                  helperText={!param.name ? "必填" : ""}
                  required
                />
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={param.type}
                  onChange={(e) => onParameterChange(index, { ...param, type: e.target.value })}
                  required
                >
                  {['string', 'number', 'boolean', 'array', 'object'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={param.required}
                  onChange={(e) => onParameterChange(index, { ...param, required: e.target.checked })}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  value={param.description}
                  onChange={(e) => onParameterChange(index, { ...param, description: e.target.value })}
                  required
                  error={!param.description}
                  helperText={!param.description ? "必填" : ""}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => {
                  onParameterDelete(index);
                  setSnackbar({ open: true, message: '参数已删除', severity: 'info' });
                }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          onParameterAdd();
          setSnackbar({ open: true, message: '新参数已添加', severity: 'success' });
        }}
        color="secondary"
        sx={{ m: 2 }}
      >
        添加参数
      </Button>
    </ScrollableTableContainer>
  );
}

function ImportDialog({ open, onClose, onImport, setSnackbar }) {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonContent(e.target.result);
        setError('');
      };
      reader.onerror = (e) => {
        setError('文件读取错误，请重试。');
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    try {
      const json = JSON.parse(jsonContent);
      onImport(json);
      onClose();
      setSnackbar({ open: true, message: 'Swagger JSON 导入成功', severity: 'success' });
    } catch (error) {
      setError('无效的 JSON 格式，请检查并重试。');
      setSnackbar({ open: true, message: '导入失败：无效的 JSON 格式', severity: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        导入 Swagger 文档
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setSnackbar({ open: true, message: '导入已取消', severity: 'info' });
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DropZone
          onClick={() => document.getElementById('file-upload').click()}
        >
          <Typography variant="body1">点击上传或拖放文件</Typography>
          <Typography variant="body2" color="textSecondary">
            支持 Swagger JSON 文件
          </Typography>
        </DropZone>
        <input
          id="file-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".json"
        />
        <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
          或粘贴 JSON 内容:
        </Typography>
        <TextField
          multiline
          rows={10}
          fullWidth
          variant="outlined"
          value={jsonContent}
          onChange={(e) => {
            setJsonContent(e.target.value);
            setError('');
          }}
          placeholder="在此粘贴 Swagger JSON..."
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onClose();
          setSnackbar({ open: true, message: '导入已取消', severity: 'info' });
        }}>
          取消
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          color="primary"
          disabled={!jsonContent.trim()}
        >
          导入
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TabPanel(props) {
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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ApiDocumentDialog({ open, onClose }) {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/pet/{petId}');
  const [apiName, setApiName] = useState('');
  const [creator, setCreator] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [apiCategory, setApiCategory] = useState('');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState([
    { name: 'name', type: 'string', required: true, description: '宠物名称' },
    { name: 'status', type: 'string', required: false, description: '状态' }
  ]);
  const [headers, setHeaders] = useState([
    { name: 'Content-Type', type: 'string', required: true, description: 'application/json' }
  ]);
  const [requestExample, setRequestExample] = useState('{\n  "name": "doggie",\n  "status": "available"\n}');
  const [responseParameters, setResponseParameters] = useState([
    { name: 'id', type: 'number', required: true, description: '宠物ID' },
    { name: 'name', type: 'string', required: true, description: '宠物名称' },
    { name: 'status', type: 'string', required: true, description: '宠物状态' }
  ]);
  const [responseExample, setResponseExample] = useState('{\n  "id": 0,\n  "name": "doggie",\n  "status": "available"\n}');
  const [codeErrorParameters, setCodeErrorParameters] = useState([
    { name: 'code', type: 'number', required: true, description: '错误代码' },
    { name: 'message', type: 'string', required: true, description: '错误信息' }
  ]);
  const [codeErrorExample, setCodeErrorExample] = useState('{\n  "code": 400,\n  "message": "Invalid ID supplied"\n}');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const now = new Date().toISOString().slice(0, 16);
    setCreatedAt(now);
  }, []);

  const handleParameterChange = useCallback((index, updatedParameter) => {
    setParameters(prevParameters => prevParameters.map((param, i) => i === index ? updatedParameter : param));
  }, []);

  const handleParameterDelete = useCallback((index) => {
    setParameters(prevParameters => prevParameters.filter((_, i) => i !== index));
  }, []);

  const handleParameterAdd = useCallback(() => {
    setParameters(prevParameters => [
      ...prevParameters,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  }, []);

  const handleHeaderChange = useCallback((index, updatedHeader) => {
    setHeaders(prevHeaders => prevHeaders.map((header, i) => i === index ? updatedHeader : header));
  }, []);

  const handleHeaderDelete = useCallback((index) => {
    if (headers.length > 1) {
      setHeaders(prevHeaders => prevHeaders.filter((_, i) => i !== index));
    } else {
      setSnackbar({ open: true, message: 'Header 必须至少保留一行', severity: 'warning' });
    }
  }, [headers]);

  const handleHeaderAdd = useCallback(() => {
    setHeaders(prevHeaders => [
      ...prevHeaders,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  }, []);

  const handleResponseParameterChange = useCallback((index, updatedParameter) => {
    setResponseParameters(prevParameters => prevParameters.map((param, i) => i === index ? updatedParameter : param));
  }, []);

  const handleResponseParameterDelete = useCallback((index) => {
    if (responseParameters.length > 1) {
      setResponseParameters(prevParameters => prevParameters.filter((_, i) => i !== index));
    } else {
      setSnackbar({ open: true, message: 'Response  必须至少保留一行', severity: 'warning' });
    }
  }, [responseParameters]);

  const handleResponseParameterAdd = useCallback(() => {
    setResponseParameters(prevParameters => [
      ...prevParameters,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  }, []);

  const handleCodeErrorParameterChange = useCallback((index, updatedParameter) => {
    setCodeErrorParameters(prevParameters => prevParameters.map((param, i) => i === index ? updatedParameter : param));
  }, []);

  const handleCodeErrorParameterDelete = useCallback((index) => {
    setCodeErrorParameters(prevParameters => prevParameters.filter((_, i) => i !== index));
  }, []);

  const handleCodeErrorParameterAdd = useCallback(() => {
    setCodeErrorParameters(prevParameters => [
      ...prevParameters,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  }, []);

  const handleImportClick = useCallback(() => {
    setImportDialogOpen(true);
  }, []);

  const handleImportClose = useCallback(() => {
    setImportDialogOpen(false);
  }, []);

  const handleImport = useCallback((json) => {
    try {
      // 解析 Swagger JSON
      const info = json.info || {};
      const firstPath = Object.keys(json.paths)[0];
      const firstMethod = Object.keys(json.paths[firstPath])[0];
      const endpoint = json.paths[firstPath][firstMethod];

      // 更新基本信息
      setApiName(info.title || '');
      setCreator(info.contact?.name || '');
      setApiCategory(info.tags?.[0]?.name || '');
      setDescription(info.description || '');

      // 更新路径和方法
      setPath(firstPath);
      setMethod(firstMethod.toUpperCase());

      // 更新参数
      const allParameters = [...(endpoint.parameters || []), ...(json.parameters || [])];
      setParameters(allParameters.filter(param => param.in !== 'header').map(param => ({
        name: param.name,
        type: param.schema?.type || param.type || 'string',
        required: param.required || false,
        description: param.description || ''
      })));

      // 更新头部
      setHeaders(allParameters.filter(param => param.in === 'header').map(param => ({
        name: param.name,
        type: 'string',
        required: param.required || false,
        description: param.description || ''
      })));

      // 更新请求示例
      const requestSchema = endpoint.requestBody?.content['application/json']?.schema;
      setRequestExample(JSON.stringify(requestSchema?.example || requestSchema || {}, null, 2));

      // 更新响应参数和示例
      const successResponse = endpoint.responses['200'] || endpoint.responses['201'];
      const responseSchema = successResponse?.content['application/json']?.schema;
      setResponseParameters(Object.entries(responseSchema?.properties || {}).map(([key, value]) => ({
        name: key,
        type: value.type || 'string',
        required: (responseSchema.required || []).includes(key),
        description: value.description || ''
      })));
      setResponseExample(JSON.stringify(successResponse?.content['application/json']?.example || responseSchema?.example || {}, null, 2));

      // 更新错误代码参数和示例
      const errorResponse = endpoint.responses['400'] || endpoint.responses['404'] || endpoint.responses['500'];
      const errorSchema = errorResponse?.content['application/json']?.schema;
      setCodeErrorParameters(Object.entries(errorSchema?.properties || {}).map(([key, value]) => ({
        name: key,
        type: value.type || 'string',
        required: (errorSchema.required || []).includes(key),
        description: value.description || ''
      })));
      setCodeErrorExample(JSON.stringify(errorResponse?.content['application/json']?.example || errorSchema?.example || {}, null, 2));

      setSnackbar({ open: true, message: 'Swagger JSON 导入成功', severity: 'success' });
    } catch (error) {
      console.error('Error parsing Swagger JSON:', error);
      setSnackbar({ open: true, message: '导入 Swagger JSON 失败: ' + error.message, severity: 'error' });
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleReset = useCallback(() => {
    setMethod('GET');
    setPath('');
    setApiName('');
    setCreator('');
    setApiCategory('');
    setDescription('');
    setParameters([]);
    setHeaders([{ name: '', type: 'string', required: false, description: '' }]);
    setRequestExample('');
    setResponseParameters([{ name: '', type: 'string', required: false, description: '' }]);
    setResponseExample('');
    setCodeErrorParameters([]);
    setCodeErrorExample('');
    const now = new Date().toISOString().slice(0, 16);
    setCreatedAt(now);
    setSnackbar({ open: true, message: '表单已重置', severity: 'info' });
  }, []);

  const validateRequiredFields = () => {
    if (!apiName) return '请填写 API 名称';
    if (!path) return '请填写 API 路径';
    if (!method) return '请选择 API 方法';
    if (!creator) return '请填写创建者';
    if (!createdAt) return '请填写创建时间';
    if (!apiCategory) return '请选择 API 类目';
    if (!description) return '请填写 API 描述';
    if (parameters.some(param => !param.name || !param.type || !param.description)) return '请填写所有参数的信息';
    if (headers.some(header => !header.name || !header.type || !header.description)) return '请填写所有头部的信息';
    if (!requestExample) return '请填写请求示例';
    if (responseParameters.some(param => !param.name || !param.type || !param.description)) return '请填写所有响应参数的信息';
    if (!responseExample) return '请填写响应示例';
    if (codeErrorParameters.some(param => !param.name || !param.type || !param.description)) return '请填写所有错误代码参数的信息';
    if (!codeErrorExample) return '请填写错误代码示例';
    return null;
  };

  const handleSave = () => {
    const errorMessage = validateRequiredFields();
    if (errorMessage) {
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } else {
      onClose();
      setSnackbar({ open: true, message: 'API 文档已保存', severity: 'success' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        API 文档
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setSnackbar({ open: true, message: '已关闭 API 文档', severity: 'info' });
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API 名称"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApiIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={!apiName}
                  helperText={!apiName ? "必填" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="创建者"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={!creator}
                  helperText={!creator ? "必填" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="创建时间"
                  type="datetime-local"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  error={!createdAt}
                  helperText={!createdAt ? "必填" : ""}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="API 类目"
                  value={apiCategory}
                  onChange={(e) => setApiCategory(e.target.value)}
                  required
                  error={!apiCategory}
                  helperText={!apiCategory ? "必填" : ""}
                >
                  <MenuItem value="用户管理">用户管理</MenuItem>
                  <MenuItem value="订单处理">订单处理</MenuItem>
                  <MenuItem value="数据分析">数据分析</MenuItem>
                  <MenuItem value="系统配置">系统配置</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="API 描述"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon color="secondary" />
                      </InputAdornment>
                    ),
                  }}
                  required
                  error={!description}
                  helperText={!description ? "必填" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MethodSelect value={method} onChange={setMethod} />
                  <TextField
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    sx={{ ml: 1, flexGrow: 1 }}
                    required
                    error={!path}
                    helperText={!path ? "必填" : ""}
                    label="URL"
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="parameter tabs"
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab label="Headers" />
            <Tab label="Request" />
            <Tab label="Response" />
            <Tab label="CodeError" />
          </Tabs>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <TabPanel value={tabValue} index={0}>
              <ParameterTable
                parameters={headers}
                onParameterChange={handleHeaderChange}
                onParameterDelete={handleHeaderDelete}
                onParameterAdd={handleHeaderAdd}
                setSnackbar={setSnackbar}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ParameterTable
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onParameterDelete={handleParameterDelete}
                onParameterAdd={handleParameterAdd}
                setSnackbar={setSnackbar}
              />
              <Typography variant="h6" sx={{ mt: 2 }} color="secondary">Request Example</Typography>
              <StyledJsonEditor
                multiline
                rows={10}
                variant="outlined"
                value={requestExample}
                onChange={(e) => setRequestExample(e.target.value)}
                label="JSON Request Example"
                fullWidth
                required
                error={!requestExample}
                helperText={!requestExample ? "必填" : ""}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <ParameterTable
                parameters={responseParameters}
                onParameterChange={handleResponseParameterChange}
                onParameterDelete={handleResponseParameterDelete}
                onParameterAdd={handleResponseParameterAdd}
                setSnackbar={setSnackbar}
              />
              <Typography variant="h6" sx={{ mt: 2 }} color="secondary">Response Example</Typography>
              <StyledJsonEditor
                multiline
                rows={10}
                variant="outlined"
                value={responseExample}
                onChange={(e) => setResponseExample(e.target.value)}
                label="JSON Response Example"
                fullWidth
                required
                error={!responseExample}
                helperText={!responseExample ? "必填" : ""}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <ParameterTable
                parameters={codeErrorParameters}
                onParameterChange={handleCodeErrorParameterChange}
                onParameterDelete={handleCodeErrorParameterDelete}
                onParameterAdd={handleCodeErrorParameterAdd}
                setSnackbar={setSnackbar}
              />
              <Typography variant="h6" sx={{ mt: 2 }} color="secondary">Code Error Example</Typography>
              <StyledJsonEditor
                multiline
                rows={10}
                variant="outlined"
                value={codeErrorExample}
                onChange={(e) => setCodeErrorExample(e.target.value)}
                label="JSON Code Error Example"
                fullWidth
                required
                error={!codeErrorExample}
                helperText={!codeErrorExample ? "必填" : ""}
              />
            </TabPanel>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleReset}>
          <RestartAltIcon sx={{ mr: 1 }} />
          重置
        </Button>
        <Button variant="contained" color="primary" onClick={handleImportClick}>
          <UploadIcon sx={{ mr: 1 }} />
          导入 Swagger
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          保存
        </Button>
      </DialogActions>
      <ImportDialog
        open={importDialogOpen}
        onClose={handleImportClose}
        onImport={handleImport}
        setSnackbar={setSnackbar}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default function ApiCatalog() {
  const [apiDocumentDialogOpen, setApiDocumentDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const apiCategories = [
    { name: '用户管理', count: 5 },
    { name: '订单处理', count: 8 },
    { name: '数据分析', count: 3 },
    { name: '系统配置', count: 6 },
  ];

  const handleAddApiDocument = () => {
    setApiDocumentDialogOpen(true);
    setSnackbar({ open: true, message: '正在打开 API 文档编辑器', severity: 'info' });
  };

  const handleCloseApiDocument = () => {
    setApiDocumentDialogOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: 'black' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              API 目录
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleAddApiDocument}
            >
              添加 API 文档
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom color="secondary">
            API 类别
          </Typography>
          <Grid container spacing={3}>
            {apiCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {category.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      API 数量: {category.count}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => setSnackbar({ open: true, message: `查看 ${category.name} 详情`, severity: 'info' })}>
                      查看详情
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <ApiDocumentDialog
        open={apiDocumentDialogOpen}
        onClose={handleCloseApiDocument}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
