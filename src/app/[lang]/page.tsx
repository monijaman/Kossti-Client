interface PageProps {
  params: {
    lang: string; // Type for the slug
  };
}

const Page = async ({ params }: PageProps) => {

  const { lang } = params
  return (
    <>
      <h2>This is {lang}</h2>
      {/* <h1>{t("title")}</h1> */}
      {/* <p>{t("content")}</p> */}

    </>
  );
};

export default Page;
