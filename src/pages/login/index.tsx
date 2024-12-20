import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthFooter from "@/components/auth/auth-footer";
import AuthHeader from "@/components/auth/auth-header";
import LoginForm from "@/components/auth/form/login";
import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "@/components/auth/form/register-form";

const Login = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <Tabs defaultValue="login">
        <TabsList className="w-full">
          <TabsTrigger value="login" className="w-full">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="w-full">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="max-w-96 w-full">
            <AuthHeader
              details="Please provider proper details"
              title="Login"
            />
            <CardContent>
              <LoginForm />
            </CardContent>
            <AuthFooter text="Login with your favorite provider" social />
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card className="max-w-96 w-full">
            <AuthHeader
              details="Please provider proper details"
              title="Register"
            />
            <CardContent>
              <RegisterForm />
            </CardContent>
            <AuthFooter text="Login with your favorite provider" social />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
