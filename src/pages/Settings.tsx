
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Mail, Bell, Database, Shield } from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataBackupFrequency, setDataBackupFrequency] = useState("daily");
  const [systemTheme, setSystemTheme] = useState("system");

  const handleSaveSettings = () => {
    toast({
      title: "设置已保存",
      description: "您的系统设置已成功更新",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">系统设置</h1>
        <p className="text-muted-foreground">管理系统的偏好设置和配置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* 通知设置 */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>通知设置</CardTitle>
                <CardDescription>配置系统的通知方式和频率</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">电子邮件通知</Label>
                  <p className="text-sm text-muted-foreground">接收有关分配变更的电子邮件通知</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allocation-reminders" className="font-medium">分配到期提醒</Label>
                  <p className="text-sm text-muted-foreground">在手机分配到期前提醒</p>
                </div>
                <Switch id="allocation-reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* 数据设置 */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>数据设置</CardTitle>
                <CardDescription>配置数据备份和导出选项</CardDescription>
              </div>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="backup-frequency">备份频率</Label>
                <Select value={dataBackupFrequency} onValueChange={setDataBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="选择备份频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">每小时</SelectItem>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <Button variant="outline" className="w-full">
                  导出数据
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="flex-1">
                <CardTitle>安全设置</CardTitle>
                <CardDescription>管理账户安全和访问控制</CardDescription>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="font-medium">两因素认证</Label>
                  <p className="text-sm text-muted-foreground">启用额外的账户安全层</p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <Separator />
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="session-timeout">会话超时（分钟）</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  defaultValue="30" 
                  className="max-w-[100px]" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统信息 */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>系统信息</CardTitle>
              <CardDescription>关于系统的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">版本</p>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">上次更新</p>
                <p className="text-sm text-muted-foreground">2025-05-10</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium">数据库状态</p>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-sm text-muted-foreground">正常</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                检查更新
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>主题设置</CardTitle>
              <CardDescription>自定义系统外观</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="theme">选择主题</Label>
                <Select value={systemTheme} onValueChange={setSystemTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="选择主题" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                    <SelectItem value="system">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="w-full">保存设置</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
