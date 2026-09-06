"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkOrderTask } from "@/types/telecom-entities.types";
import { telecomService } from "@/services/telecom.service";
import { staggerContainer, staggerItem } from "@/lib/motion";

export function TaskAllocationTab() {
  const [tasksList, setTasksList] = useState<WorkOrderTask[]>([]);

  useEffect(() => {
    let isMounted = true;
    telecomService.workforce.getTasks().then((data) => {
      if (isMounted) setTasksList(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-heading font-bold text-sm text-foreground">
            Field Splicing Work Orders & Technician Task Board
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time dispatch, progress updates, and completion logging for technician vans.
          </p>
        </div>
        <Button size="sm" onClick={() => alert("Open Create Work Order Modal")}>
          <Plus className="h-3.5 w-3.5 mr-1" /> New Work Order
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {tasksList.map((task) => (
            <motion.div
              key={task.id}
              variants={staggerItem}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-card-hover transition-all shadow-ambient space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-primary">{task.taskNo}</span>
                <Badge
                  variant={task.priority === "Critical" ? "destructive" : "warning"}
                  className="text-[10px]"
                >
                  {task.priority}
                </Badge>
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-foreground">{task.title}</h3>
                <div className="text-xs text-muted-foreground mt-0.5">
                  For: <span className="font-bold text-foreground">{task.subscriberName}</span> ({task.subscriberCode})
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" /> {task.address}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card-subtle/40 border border-border/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-warning font-bold">
                  <Truck className="h-3.5 w-3.5" />
                  <span>{task.assignedTo} ({task.vanNo})</span>
                </div>
                <Badge variant={task.status === "in_progress" ? "warning" : "secondary"}>
                  {task.status === "in_progress" ? "In Progress" : task.status === "assigned" ? "Assigned" : "To Do"}
                </Badge>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
