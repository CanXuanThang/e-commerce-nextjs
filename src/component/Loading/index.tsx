"use client";

import { CommonStates } from "@/slices/common";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

function Loading() {
  const { isLoading }: CommonStates = useSelector(
    (state: RootState) => state.common,
  );
  return (
    isLoading && (
      <div className="fixed z-99999 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="flex items-end gap-1 h-16">
          <span className="bar" />
          <span className="bar delay-100" />
          <span className="bar delay-200" />
          <span className="bar delay-300" />
          <span className="bar delay-200" />
          <span className="bar delay-100" />
          <span className="bar" />
        </div>
      </div>
    )
  );
}

export default Loading;
