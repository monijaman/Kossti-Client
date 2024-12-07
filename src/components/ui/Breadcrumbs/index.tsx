"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();

    // Split the current path into segments, excluding empty strings
    const pathSegments: string[] = pathname.split("/").filter((segment) => segment);

    return (
        <nav className="bg-gray-200 p-4">
            <ol className="flex space-x-2">
                <li>
                    <a href="/" className="text-blue-600 hover:underline">Home</a>
                </li>
                {pathSegments.map((segment, index) => {
                    const isLast: boolean = index === pathSegments.length - 1;
                    const href: string = "/" + pathSegments.slice(0, index + 1).join("/");

                    return (
                        <React.Fragment key={segment}>
                            <li>&gt;</li>
                            <li>
                                {!isLast ? (
                                    <a
                                        href={href}
                                        className="text-blue-600 hover:underline capitalize"
                                    >
                                        {segment.replace(/-/g, " ")}
                                    </a>
                                ) : (
                                    <span className="text-gray-600 capitalize">
                                        {segment.replace(/-/g, " ")}
                                    </span>
                                )}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
