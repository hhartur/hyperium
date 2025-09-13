"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  reporter_id: string;
  reported_game_id?: string | null;
  reported_user_id?: string | null;
  reason: string;
  description?: string | null;
  status: "pending" | "reviewed" | "resolved";
  created_at: Date;
  reporter?: {
    username: string;
    email: string;
  } | null;
  reported_game?: {
    title: string;
    developer: string;
  } | null;
  reported_user?: {
    username: string;
    email: string;
  } | null;
}

export function ReportManagement() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("searchQuery", searchQuery);

        const response = await fetch(`/api/admin/reports?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [searchQuery]);

  const updateReportStatus = async (
    reportId: string,
    newStatus: "pending" | "reviewed" | "resolved"
  ) => {
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update report status");
      }

      // Update local state
      setReports(
        reports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>;
      case "resolved":
        return <Badge variant="default">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      report.reason.toLowerCase().includes(searchLower) ||
      report.description?.toLowerCase().includes(searchLower) ||
      report.reporter?.username.toLowerCase().includes(searchLower) ||
      report.reported_game?.title.toLowerCase().includes(searchLower) ||
      report.reported_user?.username.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Report Management</span>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(report.status)}
                    <span className="font-medium">{report.reason}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reported by {report.reporter?.username || "Unknown"} on{" "}
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                  {report.description && (
                    <p className="text-sm mb-2">{report.description}</p>
                  )}
                  <div className="text-sm">
                    {report.reported_game && (
                      <p>
                        <strong>Game:</strong> {report.reported_game.title} by{" "}
                        {report.reported_game.developer}
                        <Link
                          href={`/games/${report.reported_game_id}`}
                          className="ml-2 text-primary-600 hover:underline"
                        >
                          View Game
                        </Link>
                      </p>
                    )}
                    {report.reported_user && (
                      <p>
                        <strong>User:</strong> {report.reported_user.username} (
                        {report.reported_user.email})
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {report.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateReportStatus(report.id, "reviewed")}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Mark as Reviewed
                  </Button>
                )}
                {report.status === "reviewed" && (
                  <Button
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "resolved")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Resolved
                  </Button>
                )}
                {report.status === "resolved" && (
                  <span className="text-sm text-muted-foreground">
                    Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
