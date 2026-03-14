import React, { useState } from "react";
import { Star, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { VerifiedBadge } from "./VerifiedBadge";

interface Review {
  id: string;
  author: string;
  authorImage?: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
  isVerifiedTenant?: boolean;
}

interface ReviewSectionProps {
  propertyId: string;
  landlordId?: string;
}

// Mock data for phase 3 frontend integration
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Rahul Sharma",
    date: "October 2023",
    rating: 5,
    content: "The property was exactly as described. The landlord is very cooperative and handles maintenance requests quickly. Highly recommend this for family stay.",
    helpful: 12,
    isVerifiedTenant: true,
  },
  {
    id: "2",
    author: "Anita Desai",
    date: "August 2023",
    rating: 4,
    content: "Great location, close to all amenities. The apartment is well-ventilated, though the parking space is a bit tight.",
    helpful: 5,
    isVerifiedTenant: true,
  }
];

export function ReviewSection({ propertyId, landlordId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      toast({
        title: "Review cannot be empty",
        description: "Please enter your experience before submitting.",
        variant: "destructive",
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      author: "Current User", // To be replaced with actual user context
      date: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      rating,
      content: newReview,
      helpful: 0,
      isVerifiedTenant: true,
    };

    setReviews([review, ...reviews]);
    setNewReview("");
    toast({
      title: "Review submitted",
      description: "Thank you for sharing your experience!",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            {averageRating.toFixed(1)} · {reviews.length} reviews
          </h2>
          <p className="text-muted-foreground mt-1">Trust and transparency are core to verified properties.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm max-w-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Cleanliness</span>
            <span className="font-medium">4.8</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="font-medium">4.9</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Communication</span>
            <span className="font-medium">4.7</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium">4.9</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Review List */}
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-card border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={review.authorImage} />
                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-1.5">
                      {review.author}
                      {review.isVerifiedTenant && <VerifiedBadge type="user" />}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      {review.date}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < review.rating ? "text-amber-500 fill-amber-500" : "text-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">
                {review.content}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Report
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Write a review */}
      <div className="rounded-xl border border-border bg-muted/40 p-6 mt-8">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5" />
          Share your experience
        </h3>
        <div className="mb-4 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  star <= rating ? "text-amber-500 fill-amber-500" : "text-border fill-muted"
                )}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="How was your stay? How was the landlord's communication?"
          className="min-h-[100px] resize-none mb-4"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </div>
      </div>
    </div>
  );
}
