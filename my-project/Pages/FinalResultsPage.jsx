import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle } from 'lucide-react';

export default function FinalResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-green-200">
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <CheckCircle className="h-8 w-8" />
            Submission Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <CardDescription className="text-lg text-gray-700 mb-8">
            Thank you for completing the registration and personality test. Your data has been successfully saved to the database.
          </CardDescription>
          <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 py-3 text-base">
            <Link to="/">Register Another Candidate</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}