import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Clean Architecture Generator',
    Svg: require('@site/static/img/icons/architecture.svg').default,
    description: (
      <>
        Generate clean architecture projects with support for Hexagonal and Onion patterns.
        Works with Spring Boot and Quarkus, supporting both reactive and imperative paradigms.
      </>
    ),
  },
  {
    title: 'Production Ready',
    Svg: require('@site/static/img/icons/framework.svg').default,
    description: (
      <>
        Built with best practices, security, and scalability in mind.
        All libraries follow clean architecture principles and SOLID design patterns.
      </>
    ),
  },
  {
    title: 'Developer First',
    Svg: require('@site/static/img/icons/generator.svg').default,
    description: (
      <>
        Focus on business logic while our tools handle the boilerplate.
        Comprehensive documentation, examples, and active community support.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
