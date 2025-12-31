/**
 * API工具函数库，用于处理与后端API的交互
 */

/**
 * 获取API基础URL
 * 从环境变量读取，如果未设置则使用相对路径
 */
export function getApiBaseUrl(): string {
  // 服务端渲染时从环境变量获取
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.BACKEND_API_URL || '/api';
  }
  
  // 客户端渲染时从运行时配置获取
  const runtimeConfig = (window as any).__NEXT_DATA__?.runtimeConfig || {};
  const configUrl = runtimeConfig.BACKEND_API_URL || 
         runtimeConfig.NEXT_PUBLIC_BACKEND_API_URL || 
         process.env.NEXT_PUBLIC_BACKEND_API_URL;
  
  // 如果配置的URL是localhost，则检查当前页面的hostname
  if (configUrl && configUrl.includes('localhost') && window.location.hostname !== 'localhost') {
    // 替换localhost为当前页面的hostname
    try {
      const url = new URL(configUrl);
      url.hostname = window.location.hostname;
      console.log(`将API URL从 ${configUrl} 替换为 ${url.toString()}`);
      return url.toString();
    } catch (e) {
      console.error('URL解析失败', e);
      return '/api';
    }
  }
  
  // 如果没有从环境变量获取到URL，则使用相对路径
  return configUrl || '/api';
}

/**
 * 构建API URL
 * @param endpoint API端点路径
 * @param params 查询参数
 */
export function buildApiUrl(endpoint: string, params?: Record<string, string>): string {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // 如果没有查询参数，直接返回URL
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  // 构建查询字符串
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return `${url}?${queryString}`;
}

/**
 * 发起API请求
 * @param endpoint API端点
 * @param options 请求选项
 * @param params 查询参数
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options?: RequestInit,
  params?: Record<string, string>
): Promise<T> {
  // 添加重试逻辑
  const maxRetries = 2;
  let lastError: any = null;
  
  // 构建URL列表尝试
  let urls = [buildApiUrl(endpoint, params)];
  
  // 添加备用URL，尝试直接使用相对路径
  if (!urls[0].startsWith('/api')) {
    urls.push(`/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
  }
  
  // 默认请求选项
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // 禁用缓存
  };
  
  // 合并请求选项
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
  };
  
  // 尝试所有可能的URL
  for (const url of urls) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`尝试请求API (${url}), 尝试次数: ${attempt + 1}/${maxRetries + 1}`);
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
          // 尝试读取错误响应
          let errorData = null;
          try {
            errorData = await response.json();
          } catch (e) {
            // 如果不是JSON格式，获取文本
            try {
              errorData = await response.text();
            } catch (textError) {
              errorData = '无法解析响应内容';
            }
          }
          
          throw new Error(`API请求失败: ${response.status} - ${errorData ? JSON.stringify(errorData) : response.statusText}`);
        }
        
        const data = await response.json() as T;
        return data;
      } catch (error) {
        lastError = error;
        console.warn(`API请求失败 (${url}), 尝试次数: ${attempt + 1}/${maxRetries + 1}`, error);
        
        // 如果是最后一次重试，继续尝试下一个URL
        if (attempt === maxRetries) {
          break;
        }
        
        // 等待一段时间再重试
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  // 所有URL和重试都失败
  console.error(`所有API请求都失败 (${endpoint}):`, lastError);
  
  // 对于特定端点，返回模拟数据以防止UI崩溃
  if (endpoint === '/server-status') {
    console.log('返回模拟的服务器状态数据');
    return {
      isOnline: false,
      timestamp: new Date().toISOString(),
      message: '无法连接到后端API服务器',
      system: {
        hostname: window.location.hostname,
        platform: navigator.platform,
        loadAverage: [{value: 0, perCore: '0', status: 'normal'}],
        cpuUsage: {average: '0'},
        memory: {
          total: '未知',
          free: '未知',
          used: '未知',
          usagePercent: '0%'
        },
        disk: {
          usagePercent: '0%',
          available: '未知',
          size: '未知',
          used: '未知',
          filesystem: '未知',
          mountedOn: '/'
        }
      },
      minecraftServer: {
        status: {
          players: {
            max: 0
          }
        },
        host: window.location.hostname,
        port: 25565
      }
    } as unknown as T;
  }
  
  throw lastError;
} 