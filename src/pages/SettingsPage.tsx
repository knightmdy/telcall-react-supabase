
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [systemName, setSystemName] = useState("办公手机管理系统");
  const [defaultDepartment, setDefaultDepartment] = useState("技术部");
  const [language, setLanguage] = useState("zh-CN");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveSettings = () => {
    // 在实际应用中，这里会保存设置到后端
    toast({
      title: "设置已保存",
      description: "系统设置已成功更新",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">系统设置</h1>

      <Card>
        <CardHeader>
          <CardTitle>基本设置</CardTitle>
          <CardDescription>配置系统的基本参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="systemName">系统名称</Label>
            <Input
              id="systemName"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="defaultDepartment">默认部门</Label>
            <Input
              id="defaultDepartment"
              value={defaultDepartment}
              onChange={(e) => setDefaultDepartment(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="language">系统语言</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>保存设置</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>配置系统通知选项</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <Label htmlFor="notifications">启用系统通知</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>保存设置</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
