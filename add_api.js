import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Plus,
  Check,
  Settings,
  Moon,
  Sun,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  AlertCircle,
  MoreHorizontal,
  Play,
  Loader,
  ChevronRight,
  ChevronLeft,
  Share2,
  Clock,
  User
} from 'lucide-react';

const MethodSelect = ({ value, onChange }) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const methodColors = {
    GET: 'text-green-500 bg-green-50',
    POST: 'text-blue-500 bg-blue-50',
    PUT: 'text-orange-500 bg-orange-50',
    DELETE: 'text-red-500 bg-red-50',
    PATCH: 'text-purple-500 bg-purple-50'
  };

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-1 rounded-md font-medium ${methodColors[value]} border-0 focus:ring-2 focus:ring-purple-200`}
    >
      {methods.map(method => (
        <option key={method} value={method}>{method}</option>
      ))}
    </select>
  );
};

const EditableText = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="px-2 py-1 border rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
          autoFocus
        />
        <button onClick={handleSave} className="text-green-500 hover:text-green-600">
          <Save className="h-4 w-4" />
        </button>
        <button onClick={handleCancel} className="text-red-500 hover:text-red-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 group">
      <span>{value}</span>
      <button 
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
      >
        <Edit2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const ParameterTable = ({ parameters, onParameterChange, onParameterDelete, onParameterAdd }) => {
  const types = ['string', 'number', 'boolean', 'array', 'object'];

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-4">
        <button 
          onClick={onParameterAdd}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-500 hover:bg-purple-50 rounded-md"
        >
          <Plus className="h-4 w-4" />
          <span>添加参数</span>
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="pb-2 font-medium">参数名</th>
            <th className="pb-2 font-medium">类型</th>
            <th className="pb-2 font-medium">必填</th>
            <th className="pb-2 font-medium">说明</th>
            <th className="pb-2 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) => onParameterChange(index, { ...param, name: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-purple-200"
                />
              </td>
              <td className="py-3">
                <select
                  value={param.type}
                  onChange={(e) => onParameterChange(index, { ...param, type: e.target.value })}
                  className="px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-purple-200"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </td>
              <td className="py-3">
                <input
                  type="checkbox"
                  checked={param.required}
                  onChange={(e) => onParameterChange(index, { ...param, required: e.target.checked })}
                  className="rounded text-purple-500 focus:ring-purple-200"
                />
              </td>
              <td className="py-3">
                <input
                  type="text"
                  value={param.description}
                  onChange={(e) => onParameterChange(index, { ...param, description: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-purple-200"
                />
              </td>
              <td className="py-3">
                <button 
                  onClick={() => onParameterDelete(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TabContent = ({ activeTab, parameters, onParameterChange, onParameterDelete, onParameterAdd, bodyContent, onBodyContentChange }) => {
  switch (activeTab) {
    case '参数':
      return (
        <ParameterTable
          parameters={parameters}
          onParameterChange={onParameterChange}
          onParameterDelete={onParameterDelete}
          onParameterAdd={onParameterAdd}
        />
      );
    case 'Body':
      return (
        <div className="mt-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <textarea
              className="w-full h-64 p-4 font-mono text-sm border rounded-md focus:ring-2 focus:ring-purple-200"
              placeholder="请输入请求体内容..."
              value={bodyContent}
              onChange={(e) => onBodyContentChange(e.target.value)}
            />
          </div>
        </div>
      );
    case 'Cookie':
    case 'Header':
    case 'Auth':
      return (
        <div className="mt-4 p-4 text-gray-500 text-center">
          {activeTab} 配置区域正在开发中...
        </div>
      );
    default:
      return (
        <div className="mt-4 p-4 text-gray-500 text-center">
          未知的标签页
        </div>
      );
  }
};

const SwaggerImportModal = ({ isOpen, onClose, onImport }) => {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          setJsonContent(content);
          setError('');
        } catch (err) {
          setError('无效的 JSON 格式');
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteJson = (e) => {
    try {
      const content = JSON.parse(e.target.value);
      setJsonContent(content);
      setError('');
    } catch (err) {
      setError('无效的 JSON 格式');
    }
  };

  const handleImport = () => {
    if (!jsonContent) {
      setError('请先上传或粘贴 Swagger JSON');
      return;
    }
    onImport(jsonContent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-2/3 max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">导入 Swagger 文档</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传</span> 或拖放文件
                  </p>
                  <p className="text-xs text-gray-500">支持 Swagger JSON 文件</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">或粘贴 JSON 内容：</p>
            <textarea
              className="w-full h-48 p-2 border rounded-md text-sm font-mono"
              onChange={(e) => handlePasteJson(e)}
              placeholder="在此粘贴 Swagger JSON..."
            />
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600"
              disabled={!!error}
            >
              导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResponsePreview = ({ response }) => {
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium">响应预览</div>
      <pre className="p-4 bg-gray-50 overflow-x-auto">
        <code>{JSON.stringify(response, null, 2)}</code>
      </pre>
    </div>
  );
};

export default function Component() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/pet/{petId}');
  const [activeTab, setActiveTab] = useState('参数');
  const [selectedContentType, setSelectedContentType] = useState('form-data');
  const [parameters, setParameters] = useState([
    { name: 'name', type: 'string', required: true, description: '宠物名称' },
    { name: 'status', type: 'string', required: false, description: '状态' }
  ]);
  const [bodyContent, setBodyContent] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [apis, setApis] = useState([]);
  const [selectedApiIndex, setSelectedApiIndex] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [response, setResponse] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [apiTitle, setApiTitle] = useState('查询宠物详情');
  const [apiStatus, setApiStatus] = useState('已发布');
  const [apiTags, setApiTags] = useState(['共享', '宠物']);
  const [apiMetadata, setApiMetadata] = useState({
    createdAt: '2024年10月27日',
    updatedAt: '15 小时前',
    creator: '狐友HrA2',
    modifier: '狐友HrA2',
    owner: '未设置',
    project: '示例项目'
  });

  const tabs = ['参数', 'Body', 'Cookie', 'Header', 'Auth'];
  const contentTypes = ['none', 'form-data', 'x-www-form-urlencoded', 'json', 'xml', 'raw', 'binary', 'GraphQL', 'msgpack'];

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleParameterChange = (index, updatedParameter) => {
    const newParameters = [...parameters];
    newParameters[index] = updatedParameter;
    setParameters(newParameters);
  };

  const handleParameterDelete = (index) => {
    const newParameters = parameters.filter((_,    i) => i !== index);
    setParameters(newParameters);
  };

  const handleParameterAdd = () => {
    setParameters([
      ...parameters,
      { name: '', type: 'string', required: false, description: '' }
    ]);
  };

  const handleSwaggerImport = (swaggerJson) => {
    try {
      const parsedApis = parseSwaggerJson(swaggerJson);
      setApis(parsedApis);
      
      if (parsedApis.length > 0) {
        setSelectedApiIndex(0);
        const firstApi = parsedApis[0];
        
        setMethod(firstApi.method);
        setPath(firstApi.path);
        setParameters(firstApi.parameters.map(param => ({
          name: param.name,
          type: param.type,
          required: param.required,
          description: param.description
        })));
      }
    } catch (error) {
      console.error('导入失败:', error);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    // 模拟API调用
    setTimeout(() => {
      setResponse({
        status: 200,
        data: {
          id: 1,
          name: "doggie",
          status: "available"
        }
      });
      setIsRunning(false);
    }, 2000);
  };

  const handleSave = () => {
    // 保存逻辑
    alert('API 已保存');
  };

  const handleDelete = () => {
    // 删除逻辑
    if (window.confirm('确定要删除这个API吗？')) {
      alert('API 已删除');
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Left Sidebar */}
      <div className={`w-64 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/api/placeholder/32/32" alt="Logo" className="w-8 h-8 rounded" />
              <h1 className="text-lg font-medium">接口管理</h1>
            </div>
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="导入 Swagger"
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-4 relative">
            <input
              type="text"
              className={`w-full pl-8 pr-4 py-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              } focus:ring-2 focus:ring-purple-200`}
              placeholder="搜索"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="mt-2">
          <div className={`px-4 py-2 flex items-center justify-between ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } cursor-pointer`}>
            <span className="text-sm">项目概览</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className={`px-4 py-2 flex items-center justify-between ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } cursor-pointer`}>
            <span className="text-sm">接口</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {apis.length > 0 && (
          <div className="mt-2 px-4">
            <h2 className="text-sm font-medium mb-2">已导入的 API</h2>
            <div className="space-y-1">
              {apis.map((api, index) => (
                <button
                  key={`${api.method}-${api.path}`}
                  className={`w-full text-left px-2 py-1 text-sm rounded ${
                    selectedApiIndex === index 
                      ? 'bg-purple-100 text-purple-600' 
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedApiIndex(index);
                    setMethod(api.method);
                    setPath(api.path);
                    setParameters(api.parameters);
                  }}
                >
                  <span className={`inline-block w-12 font-medium ${
                    api.method === 'GET' ? 'text-green-500' :
                    api.method === 'POST' ? 'text-blue-500' :
                    api.method === 'PUT' ? 'text-orange-500' :
                    api.method === 'DELETE' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>{api.method}</span>
                  <span className="truncate">{api.path}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0">
                <div className={`w-16 h-16 rounded-full border-4 ${isDarkMode ? 'border-purple-700' : 'border-purple-200'}`}></div>
                <div className="absolute top-0 left-0 w-16 h-16">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">864</span>
              </div>
            </div>
            <div className="text-sm">
              <div>通过 520</div>
              <div>失败 258</div>
              <div>未测 86</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* New Header Section */}
          <div className={`mb-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className="text-2xl font-bold mb-2">{apiTitle}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <MethodSelect value={method} onChange={setMethod} />
              <EditableText value={path} onChange={setPath} />
              <span className={`px-2 py-1 text-xs rounded-full ${
                isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                {apiStatus}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Share2 className="w-4 h-4 mr-1" />
                {apiTags.map((tag, index) => (
                  <span key={index} className="mr-2">{tag}</span>
                ))}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>创建时间 {apiMetadata.createdAt}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>修改时间 {apiMetadata.updatedAt}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>修改者 {apiMetadata.modifier}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>创建者 {apiMetadata.creator}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>责任人 {apiMetadata.owner}</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-1" />
                <span>目录 {apiMetadata.project}</span>
              </div>
            </div>
          </div>

          {/* Existing Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MethodSelect value={method} onChange={setMethod} />
              <EditableText value={path} onChange={setPath} />
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className={`px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white rounded-md`}
                onClick={handleSave}
              >
                保存
              </button>
              <button 
                className={`px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white rounded-md flex items-center`}
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader className="animate-spin mr-2 h-4 w-4" />
                    运行中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    运行
                  </>
                )}
              </button>
              <button 
                className={`px-4 py-2 text-sm ${
                  isDarkMode
                    ? 'border-gray-600 hover:bg-gray-700'
                    : 'border hover:bg-gray-50'
                } rounded-md`}
                onClick={handleDelete}
              >
                删除
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-sm ${
                    activeTab === tab
                      ? 'border-b-2 border-purple-500 text-purple-500'
                      : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="mt-4 flex space-x-4 overflow-x-auto">
            {contentTypes.map((type) => (
              <button
                key={type}
                className={`px-3 py-1 text-sm rounded-md whitespace-nowrap ${
                  selectedContentType === type
                    ? 'bg-purple-100 text-purple-500'
                    : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedContentType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <TabContent
            activeTab={activeTab}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onParameterDelete={handleParameterDelete}
            onParameterAdd={handleParameterAdd}
            bodyContent={bodyContent}
            onBodyContentChange={setBodyContent}
          />

          {/* Response Preview */}
          {response && <ResponsePreview response={response} />}
        </div>
      </div>

      {/* Theme Toggle and Navigation */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-purple-100 text-purple-500'
          }`}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Swagger Import Modal */}
      <SwaggerImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleSwaggerImport}
      />
    </div>
  );
}
