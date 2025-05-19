
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UnauthorizedMessage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
          <CardDescription>You must be logged in to access this page</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedMessage;
