"use client";

import { GitMerge, Plus, Network, Building2, Users } from "lucide-react";

export default function OrganizationHierarchyPage() {
  return (
    <div className="p-2 space-y-2 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3">
            <Network className="text-blue-500" />
            Organization Hierarchy
          </h1>
          <p className="text-gray-400 mt-1 text-xs">Visual representation of the corporate structure and reporting lines</p>
        </div>
        <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2">
          <Plus size={20} />
          <span>Add Node</span>
        </button>
      </div>

      <div className=" p-8 flex flex-col items-center justify-center min-h-[500px]">
        {/* Mock Hierarchy Tree */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-600/20 border border-blue-500 p-4 rounded-xl text-center w-64 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <h3 className=" text-white text-lg">Board of Directors</h3>
            <p className="text-blue-400 text-sm">MedixPro Group</p>
          </div>

          <div className="w-px h-8 bg-gray-600"></div>

          <div className="bg-emerald-600/20 border border-emerald-500 p-4 rounded-xl text-center w-64 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <h3 className=" text-white text-lg">Group CEO</h3>
            <p className="text-emerald-400 text-sm">Dr. Jonathan Smith</p>
          </div>

          <div className="w-px h-8 bg-gray-600"></div>

          <div className="w-[800px] h-px bg-gray-600 relative">
            <div className="absolute top-0 left-0 w-px h-8 bg-gray-600"></div>
            <div className="absolute top-0 left-[266px] w-px h-8 bg-gray-600"></div>
            <div className="absolute top-0 right-[266px] w-px h-8 bg-gray-600"></div>
            <div className="absolute top-0 right-0 w-px h-8 bg-gray-600"></div>
          </div>

          <div className="flex justify-between w-[800px] pt-8">
            <div className="bg-dark-tertiary border border-gray-700 p-4 rounded-xl text-center w-48 hover:border-blue-500 transition-colors">
              <Building2 className="mx-auto mb-2 text-gray-400" />
              <h3 className=" text-white text-sm">Operations</h3>
              <p className="text-gray-400 text-xs mt-1">Chief Operating Officer</p>
            </div>
            <div className="bg-dark-tertiary border border-gray-700 p-4 rounded-xl text-center w-48 hover:border-blue-500 transition-colors">
              <GitMerge className="mx-auto mb-2 text-gray-400" />
              <h3 className=" text-white text-sm">Clinical Excellence</h3>
              <p className="text-gray-400 text-xs mt-1">Chief Medical Officer</p>
            </div>
            <div className="bg-dark-tertiary border border-gray-700 p-4 rounded-xl text-center w-48 hover:border-blue-500 transition-colors">
              <Users className="mx-auto mb-2 text-gray-400" />
              <h3 className=" text-white text-sm">Human Resources</h3>
              <p className="text-gray-400 text-xs mt-1">Chief HR Officer</p>
            </div>
            <div className="bg-dark-tertiary border border-gray-700 p-4 rounded-xl text-center w-48 hover:border-blue-500 transition-colors">
              <h3 className=" text-white text-sm">Finance & Strategy</h3>
              <p className="text-gray-400 text-xs mt-1">Chief Financial Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
