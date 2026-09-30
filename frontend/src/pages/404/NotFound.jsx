// import { errorPageShap, leftArrowIcon } from "@/assets/icon/Icon";
// import Button from "@/components/common/Button";
// import { Link } from "react-router-dom";

import { downTrunArrowIcon, leftArrowIcon, newLogo } from "@/assets/icon/Icon";
import { mascot, mascot1 } from "@/assets/image/Main";

// export default function NotFound() {
//     return (
//         <div className="min-h-svh h-auto relative z-10 before:content-[''] before:absolute before:bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFFFF00_50%,#FFFFFF_100%),linear-gradient(270deg,#FFFFFF_0%,#FFFFFF00_50%,#FFFFFF_100%)] before:left-0 before:top-0 before:w-full before:h-full before:-z-[9] overflow-hidden">
//             <span className="aspect-[1378/632] w-[1378px] *:size-full block absolute left-1/2 top-1/2 -translate-1/2 -z-10">{errorPageShap}</span>
//             <div className="flex flex-col items-center justify-center gap-10 py-10 px-5 min-h-[calc(100svh-80px)]">
//                 <div className="space-y-4 max-w-[1100px] w-full mx-auto">
//                     <div className="w-fit mx-auto py-1.5 px-5 rounded-full border border-danger/10 bg-danger/10 text-base text-danger font-bold backdrop-blur-md">404</div>
//                     <div className="space-y-7">
//                         <h1 className="text-8xl font-bold text-secondary text-center">Oops! Page not found.</h1>
//                         <p className="text-3xl text-secondary/80 text-center max-w-[700px] w-full mx-auto">
//                             We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <Button
//                         link
//                         primaryBtn
//                         url="/"
//                         className="pr-5 bg-danger hover:bg-danger border-danger">
//                         Back To Home Page
//                         <span className="size-6 min-w-6 *:rotate-180">
//                             {leftArrowIcon}
//                         </span>
//                     </Button>
//                     <Link to={'/'} className="text-base font-bold text-secondary hover:text-primary underline transition-colors">
//                         Visit Our Help Center
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }

// import { createFileRoute } from "@tanstack/react-router";
// import { ArrowRight, CornerDownRight, FileQuestion } from "lucide-react";

// import mascot from "@/assets/images/404Img1.png";

export default function NotFound() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-errorpage flex flex-col">
            <div className="pointer-events-none absolute inset-0 grid-backdrop" aria-hidden="true" />

            <header className="relative mx-auto flex w-full max-w-6xl items-center px-5 py-7">
                {/* <a href="/" className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-[15px] font-extrabold text-primary-foreground">
                        V
                    </span>
                    <span className="text-[15px] font-bold tracking-tight text-foreground">
                        Vyapar <span className="text-primary">Note</span>
                    </span>
                </a> */}
                <a href="/" className="flex items-center text-primary *:size-full outline-none aspect-[150/64] w-[100px]">
                    {newLogo}
                </a>
            </header>

            <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-5 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-14 my-auto">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        {/* <FileQuestion className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} /> */}
                        Error 404
                    </div>

                    <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
                        Oops! Page not found.
                    </h1>

                    <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
                        We couldn't find the page you're looking for. It might have been moved or doesn't
                        exist anymore.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                        <a
                            href="/"
                            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_20px_-12px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-colors hover:bg-primary-hover"
                        >
                            Back to Home
                            {/* <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                strokeWidth={2.4}
                            /> */}
                            <span className="size-4 transition-transform group-hover:translate-x-0.5 rotate-180">{leftArrowIcon}</span>
                        </a>
                        <a
                            href="/help"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                        >
                            {/* <CornerDownRight className="h-4 w-4 text-muted-foreground" strokeWidth={2.2} /> */}
                            <span className="size-4 text-muted-foreground">{downTrunArrowIcon}</span>
                            Visit Help Center
                        </a>
                    </div>

                    <div className="mt-12 flex items-center gap-3" aria-hidden="true">
                        <span className="h-1 flex-1 max-w-[180px] dotted-path" />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-xs font-medium tracking-wide text-muted-foreground">
                            route ends here
                        </span>
                    </div>
                </div>

                <div className="relative flex items-end justify-center lg:justify-end">
                    <span
                        className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 select-none text-[13rem] font-extrabold leading-none tracking-tighter text-foreground/[0.055] sm:text-[16rem] lg:bottom-0"
                        aria-hidden="true"
                    >
                        404
                    </span>
                    <img
                        src={mascot1}
                        width={1024}
                        height={1280}
                        alt="Vyapar Note mascot looking confused while checking a tablet showing a missing page"
                        className="relative w-[280px] max-w-full sm:w-[360px] lg:w-[440px]"
                        draggable={false}
                    />
                    <span
                        className="pointer-events-none absolute bottom-4 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-xl"
                        aria-hidden="true"
                    />
                </div>
            </section>

            <footer className="relative mx-auto w-full max-w-6xl border-t border-border px-5 py-5 mt-auto">
                <p className="text-xs text-muted-foreground">
                    © 2026 Vyapar Note. All rights reserved.
                </p>
            </footer>
        </main>
    );
}