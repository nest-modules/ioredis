import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>{' '}
          <Link
            className="button button--outline button--lg"
            href="https://github.com/nest-modules/ioredis"
            style={{ color: 'white', borderColor: 'white' }}
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickInstall() {
  return (
    <section style={{ padding: '2rem 0', textAlign: 'center' }}>
      <div className="container">
        <Heading as="h2">Quick Install</Heading>
        <pre
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
          }}
        >
          <code>pnpm add @nestjs-modules/ioredis ioredis</code>
        </pre>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <QuickInstall />
      </main>
    </Layout>
  );
}
