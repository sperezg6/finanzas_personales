"use client"

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

// Types for our Sankey data
interface SankeyNode {
  id: string
  name: string
  category?: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

interface SankeyChartProps {
  data: SankeyData
  width?: number
  height?: number
  nodePadding?: number
  nodeWidth?: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export default function SankeyChart({
  data,
  width = 800,
  height = 500,
  nodePadding = 20,
  nodeWidth = 15,
  margin = { top: 10, right: 10, bottom: 10, left: 10 }
}: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes.length) return

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove()

    // Prepare the D3 sankey diagram
    const sankeyLayout = sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
    
    // Format the data for D3 sankey
    const sankeyData = {
      nodes: data.nodes.map(node => ({ ...node })),
      links: data.links.map(link => ({
        ...link,
        source: link.source,
        target: link.target,
        value: link.value
      }))
    }
    
    // Generate the sankey diagram
    const { nodes, links } = sankeyLayout(sankeyData as any)
    
    // Create the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
    
    // Create the node rectangles
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)
    
    // Add the rectangles for the nodes
    node.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => {
        // Different colors based on node category
        const colors: Record<string, string> = {
          income: '#66c2a5',
          expense: '#fc8d62',
          category: '#8da0cb',
          subcategory: '#e78ac3',
          default: '#a6d854'
        }
        return colors[d.category || 'default']
      })
      .attr('opacity', 0.8)
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5)
    
    // Add labels to the nodes
    node.append('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? nodeWidth + 6 : -6)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .text((d: any) => d.name)
      .attr('font-size', 12)
      .attr('fill', '#333')
    
    // Add values to the nodes
    node.append('text')
      .attr('x', (d: any) => d.x0 < width / 2 ? nodeWidth + 6 : -6)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2)
      .attr('dy', '1.5em')
      .attr('text-anchor', (d: any) => d.x0 < width / 2 ? 'start' : 'end')
      .text((d: any) => `$${Math.round(d.value).toLocaleString()}`)
      .attr('font-size', 10)
      .attr('fill', '#666')
    
    // Create the links between nodes
    const link = svg.append('g')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal() as any)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => {
        // Color based on source node
        return d.source.category === 'income' ? '#66c2a5' : '#fc8d62';
      })
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('opacity', 0.5)
    
    // Add hover effects
    node
      .on('mouseover', function() {
        d3.select(this).attr('opacity', 0.8)
        link
          .filter((l: any) => l.source.id === (d3.select(this).datum() as any).id || 
                          l.target.id === (d3.select(this).datum() as any).id)
          .attr('opacity', 0.8)
          .attr('stroke-width', (d: any) => Math.max(2, d.width))
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1)
        link
          .attr('opacity', 0.5)
          .attr('stroke-width', (d: any) => Math.max(1, d.width))
      })

  }, [data, width, height, nodeWidth, nodePadding, margin])

  return (
    <div className="sankey-container w-full overflow-x-auto">
      <svg ref={svgRef} width="100%" height={height} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${width} ${height}`} />
    </div>
  )
}